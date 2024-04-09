import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
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

// Get measurements from Firestore
export const getMeasurements = async () => {
    const measurementsCol = collection(db, collectionName);
    const snapshot = await getDocs(measurementsCol);
    const measurementsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Add the ID to the data
    return measurementsList;
}

// Add a new measurement to Firestore
export const addMeasurement = async measurement => {
    const measurementRef = collection(db, collectionName);
    await addDoc(measurementRef, measurement);
}

// Delete a measurement from Firestore
export const deleteMeasurement = async id => {
    const measurementRef = doc(db, collectionName, id);
    await deleteDoc(measurementRef);
}

// Update a measurement in Firestore
export const updateMeasurement = async (id, newData) => {
    const measurementRef = doc(db, collectionName, id);
    await updateDoc(measurementRef, newData);
}