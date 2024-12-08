import { getMeasurements, updateMeasurement } from '../db/measurements.js';

const measures = ['temperature', 'humidity', 'pressure', 'gas', 'pm1', 'pm25', 'pm10'];
const measurementsStats = {}; // Mean and standard deviation of every measurement
const threshold = 2; // Z-score threshold for anomaly detection

// Calculate the mean and the standard deviation
const calculateMeanAndStd = values => {
    const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
    const std = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
    return { mean, std };
};

// Calculate the Z-score
const calculateZScore = (value, mean, std) => {
    return (value - mean) / std;
};

// Check if a measurement is an anomaly
const isAnomaly = (value, mean, std) => {
    let zScore = calculateZScore(value, mean, std);
    return Math.abs(zScore) > threshold;
};

// Calculate the stats for every feature
const calculateStats = measurements => {
    measures.forEach(measure => { // For every feature
        measurementsStats[measure] = calculateMeanAndStd(measurements.map(item => item[measure]));
    });
};

// Mark the anomalies in the database
const markAnomalies = async measurements => {
    let measurement;
    for (let item of measurements) {
        measurement = {}; // Start from a clean object
        measures.forEach(measure => { // For every feature
            measurement[`${measure}Anomaly`] = isAnomaly(item[measure], measurementsStats[measure].mean, measurementsStats[measure].std);
        });
        await updateMeasurement(item.id, measurement); // Update the measurement in the database
    }
};

// Execute the anomaly detection batch
export const anomalyDetection = async () => {
    const measurements = await getMeasurements(); // Get the measurements from the database
    if (!measurements?.results?.length > 0) throw new Error('Measurements not found');
    if (measurements.length % 24 === 0) { // Only every 24 measurements
        calculateStats(measurements.results); // Calculate the stats for every feature
        await markAnomalies(measurements.results); // Mark the anomalies in the database
    }
};

// Add the anomaly values to the measurement
export const addAnomalyValues = async measurement => {
    if (!measurementsStats.temperature?.mean) { // If empty, calculate the stats
        const measurements = await getMeasurements(); // Get the measurements from the database
        if (!measurements?.results?.length > 0) return measurement;
        calculateStats(measurements.results); // Calculate the stats
    }

    // Add the anomaly values
    measures.forEach(measure => { // For every feature
        measurement[`${measure}Anomaly`] = isAnomaly(measurement[measure], measurementsStats[measure].mean, measurementsStats[measure].std);
    });
    return measurement;
};