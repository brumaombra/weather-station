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
    if (params.period) addPeriodFilter(conditions, params); // Add period filter (Last day, week, month or year)
    if (params.lastDocumentId) await addLastDocumentId(conditions, params); // Add last document for pagination
    const firebaseQuery = query(measurementsCol, ...conditions); // Create the query
    const snapshot = await getDocs(firebaseQuery);
    const measurementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Add the ID to the data
    return measurementsList;
};

// Add a new measurement to Firestore
export const addMeasurement = async measurement => {
    measurement.timestamp = Timestamp.fromDate(new Date()); // Add the timestamp
    const measurementRef = collection(db, collectionName);
    await addDoc(measurementRef, measurement);
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