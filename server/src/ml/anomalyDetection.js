import { getMeasurements, updateMeasurement } from '../db/sql.js';

// Mean and standard deviation of every measurement
const measurementsStats = {
    temperature: {},
    humidity: {},
    pressure: {},
    gas: {},
    pm1: {},
    pm25: {},
    pm10: {}
};

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
    measurementsStats.temperature = calculateMeanAndStd(measurements.map(item => item.temperature));
    measurementsStats.humidity = calculateMeanAndStd(measurements.map(item => item.humidity));
    measurementsStats.pressure = calculateMeanAndStd(measurements.map(item => item.pressure));
    measurementsStats.gas = calculateMeanAndStd(measurements.map(item => item.gas));
    measurementsStats.pm1 = calculateMeanAndStd(measurements.map(item => item.pm1));
    measurementsStats.pm25 = calculateMeanAndStd(measurements.map(item => item.pm25));
    measurementsStats.pm10 = calculateMeanAndStd(measurements.map(item => item.pm10));
};

// Mark the anomalies in the database
const markAnomalies = async measurements => {
    let measurement;
    for (let item of measurements) {
        measurement = {}; // Start from a clean object
        measurement.temperatureAnomaly = isAnomaly(item.temperature, measurementsStats.temperature.mean, measurementsStats.temperature.std);
        measurement.humidityAnomaly = isAnomaly(item.humidity, measurementsStats.humidity.mean, measurementsStats.humidity.std);
        measurement.pressureAnomaly = isAnomaly(item.pressure, measurementsStats.pressure.mean, measurementsStats.pressure.std);
        measurement.gasAnomaly = isAnomaly(item.gas, measurementsStats.gas.mean, measurementsStats.gas.std);
        measurement.pm1Anomaly = isAnomaly(item.pm1, measurementsStats.pm1.mean, measurementsStats.pm1.std);
        measurement.pm25Anomaly = isAnomaly(item.pm25, measurementsStats.pm25.mean, measurementsStats.pm25.std);
        measurement.pm10Anomaly = isAnomaly(item.pm10, measurementsStats.pm10.mean, measurementsStats.pm10.std);
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
    measurement.temperatureAnomaly = isAnomaly(measurement.temperature, measurementsStats.temperature.mean, measurementsStats.temperature.std);
    measurement.humidityAnomaly = isAnomaly(measurement.humidity, measurementsStats.humidity.mean, measurementsStats.humidity.std);
    measurement.pressureAnomaly = isAnomaly(measurement.pressure, measurementsStats.pressure.mean, measurementsStats.pressure.std);
    measurement.gasAnomaly = isAnomaly(measurement.gas, measurementsStats.gas.mean, measurementsStats.gas.std);
    measurement.pm1Anomaly = isAnomaly(measurement.pm1, measurementsStats.pm1.mean, measurementsStats.pm1.std);
    measurement.pm25Anomaly = isAnomaly(measurement.pm25, measurementsStats.pm25.mean, measurementsStats.pm25.std);
    measurement.pm10Anomaly = isAnomaly(measurement.pm10, measurementsStats.pm10.mean, measurementsStats.pm10.std);
    return measurement;
};