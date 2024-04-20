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

// Add last document for pagination
const addLastDocumentId = async (conditions, params) => {
    const lastDocRef = doc(db, collectionName, params.lastDocumentId);
    const lastDocSnapshot = await getDoc(lastDocRef);
    if (lastDocSnapshot.exists()) conditions.push(startAfter(lastDocSnapshot)); // Add the doc if exist
};

// Add start date and end date filters
const addDatesFilter = (conditions, params) => {
    if (params.startDate) { // Add start date
        const startDate = getMaxAndMinFromDate(new Date(params.startDate)).minDate;
        conditions.push(where('timestamp', '>=', Timestamp.fromDate(startDate)));
    }
    if (params.endDate) { // Add end date
        const endDate = getMaxAndMinFromDate(new Date(params.endDate)).maxDate;
        conditions.push(where('timestamp', '<=', Timestamp.fromDate(endDate)));
    }
};

// Get measurements from Firestore
export const getMeasurements = async params => {
    const measurementsCol = collection(db, collectionName);
    let conditions = []; // List of conditions to filter the query
    conditions.push(orderBy(params.orderField || 'timestamp', params.orderDirection || 'desc')); // Add order filter
    conditions.push(limit(params.limit || 25)); // Add limit filter
    if (params.startDate || params.endDate) addDatesFilter(conditions, params); // Add start and end date filters
    if (params.lastDocumentId) await addLastDocumentId(conditions, params); // Add last document for pagination
    const firebaseQuery = query(measurementsCol, ...conditions); // Create the query
    const snapshot = await getDocs(firebaseQuery);
    const measurementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Add the ID to the data
    return measurementsList;
};

// Add start date and end date filters to aggregated data
const addDatesFilterAggregatedData = (conditions, params) => {
    if (params.startDate) { // Add start date
        const startDate = getMaxAndMinFromDate(new Date(params.startDate)).minDate;
        conditions.push(where('date', '>=', Timestamp.fromDate(startDate)));
    }
    if (params.endDate) { // Add end date
        const endDate = getMaxAndMinFromDate(new Date(params.endDate)).maxDate;
        conditions.push(where('date', '<=', Timestamp.fromDate(endDate)));
    }
};

// Get aggregated daily measurements from Firestore
export const getAggregatedDailyMeasurements = async params => {
    const aggregatedDailyDataCol = collection(db, aggregatedDailyCollectionName);
    let conditions = []; // List of conditions to filter the query
    conditions.push(orderBy(params.orderField || 'date', params.orderDirection || 'asc')); // Add order filter
    conditions.push(limit(params.limit || 365)); // Add limit filter
    if (params.startDate || params.endDate) addDatesFilterAggregatedData(conditions, params); // Add start and end date filters
    const firebaseQuery = query(aggregatedDailyDataCol, ...conditions); // Create the query
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

// Get yesterday
const getYesterdayAtNoon = () => {
    const today = new Date();
    today.setUTCHours(12, 0, 0, 0);
    const yesterdayAtNoon = new Date(today - 24 * 60 * 60 * 1000);
    return yesterdayAtNoon;
};

// Get min and max date from a date
const getMaxAndMinFromDate = date => {
    let minDate = new Date(date);
    minDate.setUTCHours(0, 0, 0, 0);
    let maxDate = new Date(date);
    maxDate.setUTCHours(23, 59, 59, 999);
    return { minDate, maxDate };
};

// Check if there is already the data for a date
const checkIfAggregatedDataExist = async date => {
    const aggregatedDailyDataCol = collection(db, aggregatedDailyCollectionName);
    const { minDate, maxDate } = getMaxAndMinFromDate(date);
    let conditions = []; // List of conditions to filter the query
    conditions.push(where('date', '>=', Timestamp.fromDate(minDate))); // Add the filter for the min date
    conditions.push(where('date', '<=', Timestamp.fromDate(maxDate))); // Add the filter for the max date
    conditions.push(limit(1)); // Add limit filter
    const firebaseQuery = query(aggregatedDailyDataCol, ...conditions);
    const querySnapshot = await getDocs(firebaseQuery);
    return !querySnapshot.empty; // Return true if there is already the data
};

// Get data from a date
const getDataFromDate = async date => {
    const measurementsCol = collection(db, collectionName);
    const { minDate, maxDate } = getMaxAndMinFromDate(date);
    let conditions = []; // List of conditions to filter the query
    conditions.push(where('timestamp', '>=', Timestamp.fromDate(minDate))); // Add the filter for the min date
    conditions.push(where('timestamp', '<=', Timestamp.fromDate(maxDate))); // Add the filter for the max date
    const firebaseQuery = query(measurementsCol, ...conditions);
    const querySnapshot = await getDocs(firebaseQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Create aggregated daily data
const createAggregatedMeasurement = measurements => {
    let aggregatedMeasurement = {
        humidity: { max: -Infinity, min: Infinity, avg: 0 },
        temperature: { max: -Infinity, min: Infinity, avg: 0 }
    };

    // Loop through the measurements and aggregate them
    measurements.forEach(measurement => {
        aggregatedMeasurement.humidity.max = Math.max(aggregatedMeasurement.humidity.max, measurement.humidity);
        aggregatedMeasurement.humidity.min = Math.min(aggregatedMeasurement.humidity.min, measurement.humidity);
        aggregatedMeasurement.humidity.avg += measurement.humidity;
        aggregatedMeasurement.temperature.max = Math.max(aggregatedMeasurement.temperature.max, measurement.temperature);
        aggregatedMeasurement.temperature.min = Math.min(aggregatedMeasurement.temperature.min, measurement.temperature);
        aggregatedMeasurement.temperature.avg += measurement.temperature;
    });

    // Calculate the averages
    aggregatedMeasurement.humidity.avg /= measurements.length;
    aggregatedMeasurement.temperature.avg /= measurements.length;
    return aggregatedMeasurement;
};

// Add aggregated daily data to Firestore
const addAggregatedDailyData = async () => {
    const yesterday = getYesterdayAtNoon(); // Get yesterday
    const dataPresent = await checkIfAggregatedDataExist(yesterday); // Check if there is already the data for yesterday
    if (dataPresent) return; // If there is already the data for yesterday, exit
    const yesterdayData = await getDataFromDate(yesterday); // Get the data for yesterday
    if (yesterdayData.length === 0) return; // If there is no data for yesterday, exit
    let aggregatedDailyMeasurement = createAggregatedMeasurement(yesterdayData); // Create the aggregated data
    aggregatedDailyMeasurement.date = Timestamp.fromDate(yesterday); // Add the date
    const aggregatedDailyDataCol = collection(db, aggregatedDailyCollectionName);
    await addDoc(aggregatedDailyDataCol, aggregatedDailyMeasurement); // Add the data to Firestore
    console.log('Added aggregated daily data');
};