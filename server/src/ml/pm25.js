import { trainModelRegression, getPrediction } from "./ml.js";
import { getMeasurements } from '../db/sql.js';

let pm25PredictionModel = null;
let pm25PredictionMean = null;
let pm25PredictionStd = null;

// Format the training data
const formatTrainingData = data => {
    const X_train = data.map(item => [
        item.temperature,
        item.humidity,
        item.pressure,
        item.gas,
        item.pm10
    ]);
    const y_train = data.map(item => item.pm25);
    return { X_train, y_train };
};

// Train the PM2.5 model
export const trainPm25Model = async () => {
    try {
        const measurements = await getMeasurements(); // Get the measurements from the database
        if (!measurements) throw new Error('Measurements not found'); // Check if the measurements are found
        const { X_train, y_train } = formatTrainingData(measurements.results); // Format the training data and the labels
        const pm25Prediction = await trainModelRegression(X_train, y_train); // Train the model
        pm25PredictionModel = pm25Prediction.model; // Save the trained model
        pm25PredictionMean = pm25Prediction.X_mean; // Save the normalization parameters
        pm25PredictionStd = pm25Prediction.X_std; // Save the normalization parameters
    } catch (error) {
        const newError = new Error('Error while training the model', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the PM2.5 prediction
export const getPm25Prediction = async X_test => {
    try {
        if (!X_test) throw new Error('Input data is required'); // Check if the input data is provided
        if (!pm25PredictionModel || !pm25PredictionMean || !pm25PredictionStd) throw new Error('Model not trained'); // Check if the model is trained
        const prediction = await getPrediction(pm25PredictionModel, X_test, pm25PredictionMean, pm25PredictionStd); // Get the prediction
        return prediction; // Return the prediction
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};