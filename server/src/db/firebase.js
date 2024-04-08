import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Initialize Firebase
const firebaseApp = initializeApp({
    apiKey: 'AIzaSyAyyFY1B0fmXDR3s-TJjzd3JebmwxYw-nY',
    authDomain: 'weather-station-eba51.firebaseapp.com',
    projectId: 'weather-station-eba51',
    storageBucket: 'weather-station-eba51.appspot.com',
    messagingSenderId: '670794897945',
    appId: '1:670794897945:web:a99ccdfed0ba5ef82ba888'
});
const db = getFirestore(firebaseApp); // Firestore DB

// Get measurements from Firestore
export const getMeasurements = async () => {
    const misureCol = collection(db, 'measurements');
    const misureSnapshot = await getDocs(misureCol);
    const misureList = misureSnapshot.docs.map(doc => doc.data());
    return misureList;
}

// Add a new measurement to Firestore
export const addMeasurement = async measurement => {
    const measurementRef = collection(db, 'measurements');
    await addDoc(measurementRef, measurement);
}