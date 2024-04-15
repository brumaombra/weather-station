import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, doc, addDoc, getDocs, getDoc, updateDoc, Timestamp, orderBy, limit, startAfter, writeBatch } from 'firebase/firestore';
dotenv.config(); // Load the .env file

// Initialize Firebase
const firebaseApp = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});
const db = getFirestore(firebaseApp); // Firestore DB
const collectionName = 'measurements'; // Collection name
const aggregatedDailyCollectionName = 'aggregatedDailyMeasurements'; // Aggregated daily data

// Convert days to milliseconds
const daysToMilliseconds = days => {
    return days * 24 * 60 * 60 * 1000;
};

// Add period filter to the query
const addPeriodFilter = (conditions, params) => {
    let days = 1; // Number of days to filter
    switch (params.period) {
        case 'D':
            days = 1;
            break;
        case 'W':
            days = 7;
            break;
        case 'M':
            days = 30;
            break;
        case 'Y':
            days = 365;
            break;
    }

    // Create the start and end dates
    const today = new Date();
    const start = new Date(today.getTime() - daysToMilliseconds(days));
    const end = new Date(today.getTime() + daysToMilliseconds(1));
    const firestoreStart = Timestamp.fromDate(start);
    const firestoreEnd = Timestamp.fromDate(end);
    conditions.push(where('timestamp', '>=', firestoreStart)); // Add the filter
    conditions.push(where('timestamp', '<', firestoreEnd)); // Add the filter
};

// Add last document for pagination
const addLastDocumentId = async (conditions, params) => {
    const lastDocRef = doc(db, collectionName, params.lastDocumentId);
    const lastDocSnapshot = await getDoc(lastDocRef);
    if (lastDocSnapshot.exists()) conditions.push(startAfter(lastDocSnapshot)); // Add the doc if exist
};

// Get measurements from Firestore
export const getMeasurements = async params => {
    const measurementsCol = collection(db, collectionName);
    let conditions = []; // List of conditions to filter the query
    conditions.push(orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc')); // Add order filter
    conditions.push(limit(params.limit || 25)); // Add limit filter
    // if (params.period) addPeriodFilter(conditions, params); // Add period filter (Last day, week, month or year)
    if (params.lastDocumentId) await addLastDocumentId(conditions, params); // Add last document for pagination
    const firebaseQuery = query(measurementsCol, ...conditions); // Create the query
    const snapshot = await getDocs(firebaseQuery);
    const measurementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Add the ID to the data
    return measurementsList;
};

// Get aggregated daily measurements from Firestore
export const getAggregatedDailyMeasurements = async params => {
    const aggregatedDailyDataRef = collection(db, aggregatedDailyCollectionName);
    let conditions = []; // List of conditions to filter the query
    // conditions.push(orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc')); // Add order filter
    conditions.push(limit(params.limit || 50)); // Add limit filter
    // if (params.period) addPeriodFilter(conditions, params); // Add period filter (Last day, week, month or year)
    const firebaseQuery = query(aggregatedDailyDataRef, ...conditions); // Create the query
    const snapshot = await getDocs(firebaseQuery);
    const measurementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Add the ID to the data
    return measurementsList;
};

// Add a new measurement to Firestore
export const addMeasurement = async measurement => {
    measurement.timestamp = Timestamp.fromDate(new Date()); // Add the timestamp
    const measurementRef = collection(db, collectionName);
    await addDoc(measurementRef, measurement);
    await addAggregatedDailyData(); // Add aggregated daily data if needed
};

// Delete one or multiple measurements from Firestore
export const deleteMeasurements = async idList => {
    const batch = writeBatch(db);
    idList.forEach(id => { // Loop through the IDs
        const measurementRef = doc(db, collectionName, id);
        batch.delete(measurementRef);
    });
    await batch.commit();
};

// Update a measurement in Firestore
export const updateMeasurement = async (id, newData) => {
    const measurementRef = doc(db, collectionName, id);
    await updateDoc(measurementRef, newData);
};

// From date object to DD/MM/YYYY
const fromDateToDDMMYYYY = date => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Get today
const getToday = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
}

// Get yesterday
const getYesterday = () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const yesterdayAtMidnight = new Date(today - 24 * 60 * 60 * 1000);
    return yesterdayAtMidnight;
};

// Check if there is already the data for a date
const checkIfAggregatedDataExist = async date => {
    const aggregatedDailyDataRef = collection(db, aggregatedDailyCollectionName);
    const firebaseQuery = query(aggregatedDailyDataRef, where('date', '==', date));
    const snapshot = await getDocs(firebaseQuery);
    return snapshot.docs.length > 0; // Return true if there is already the data
};

// Add aggregated daily data to Firestore
const addAggregatedDailyData = async () => {
    const yesterday = fromDateToDDMMYYYY(getYesterday()); // Get yesterday
    const dataPresent = await checkIfAggregatedDataExist(yesterday); // Check if there is already the data for yesterday
    if (dataPresent) return; // If there is already the data for yesterday, exit

    // Get the data for yesterday
    const measurementsCol = collection(db, collectionName);
    let conditions = [];
    conditions.push(where('timestamp', '>', Timestamp.fromDate(getYesterday()))); // Add the filter for yesterday
    conditions.push(where('timestamp', '<', Timestamp.fromDate(getToday()))); // Add the filter for today
    const firebaseQuery = query(measurementsCol, ...conditions); // Create the query
    const querySnapshot = await getDocs(firebaseQuery); // Get the data
    if (querySnapshot.empty) return; // If there is no data for yesterday, exit

    // Initialize the aggregations
    let humiditySum = 0;
    let humidityCount = 0;
    let humidityMax = -Infinity;
    let humidityMin = Infinity;
    let temperatureSum = 0;
    let temperatureCount = 0;
    let temperatureMax = -Infinity;
    let temperatureMin = Infinity;

    // Loop through the data and aggregate it
    console.log(getYesterday());
    console.log(getToday());
    console.log(querySnapshot.docs.length);
    querySnapshot.docs.forEach(doc => {
        const temperature = doc.data().temperature;
        const humidity = doc.data().humidity;

        // Aggregate temperature
        temperatureSum += temperature;
        temperatureCount++;
        if (temperature > temperatureMax) temperatureMax = temperature;
        if (temperature < temperatureMin) temperatureMin = temperature;

        // Aggregate humidity
        humiditySum += humidity;
        humidityCount++;
        if (humidity > humidityMax) humidityMax = humidity;
        if (humidity < humidityMin) humidityMin = humidity;
    });

    // Create the aggregated data
    const aggregatedDailyMeasurement = {
        date: yesterday,
        humidityMax: humidityMax,
        humidityMin: humidityMin,
        humidityAvg: humiditySum / humidityCount,
        temperatureMax: temperatureMax,
        temperatureMin: temperatureMin,
        temperatureAvg: temperatureSum / temperatureCount
    };

    // Add the record to Firestore
    const aggregatedDailyDataRef = collection(db, aggregatedDailyCollectionName);
    await addDoc(aggregatedDailyDataRef, aggregatedDailyMeasurement);
};