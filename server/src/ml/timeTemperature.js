import { trainModelRegression, getPrediction } from "./ml.js";
import { getMeasurements } from '../db/sql.js';

const polynomialDegree = 5;
let predictionModel = null;
let predictionMean = null;
let predictionStd = null;

// Format the training data
const formatTrainingData = data => {
    const X_train = [];
    data.forEach(item => { // Extract the hour and minute from the timestamp
        const timestamp = new Date(item.timestamp);
        const hour = timestamp.getHours();
        const minute = timestamp.getMinutes();
        const time = hour + minute / 60; // Transform the time to a decimal number
        X_train.push([time]);
    });
    const y_train = data.map(item => item.temperature);
    return { X_train, y_train };
};

// Train the model
export const trainTimeTempModel = async () => {
    try {
        const measurements = await getMeasurements(); // Get the measurements from the database
        if (!measurements) throw new Error('Measurements not found'); // Check if the measurements are found
        const { X_train, y_train } = formatTrainingData(measurements.results); // Format the training data and the labels
        const prediction = await trainModelRegression(X_train, y_train, polynomialDegree); // Train the model
        predictionModel = prediction.model; // Save the trained model
        predictionMean = prediction.X_mean; // Save the normalization parameters
        predictionStd = prediction.X_std; // Save the normalization parameters
    } catch (error) {
        const newError = new Error('Error while training the model', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the prediction
export const getTimeTempPrediction = async X_test => {
    try {
        if (!X_test) throw new Error('Input data is required'); // Check if the input data is provided
        if (!predictionModel) await trainTemperatureHumidityModel(); // Train the model if it is not trained
        const prediction = await getPrediction(predictionModel, X_test, predictionMean, predictionStd, polynomialDegree); // Get the prediction
        return prediction; // Return the prediction
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

/* Generate predictions
export const createTimeTempCorrelationData = async () => {
    let predictions = [];
    for (let i = 0; i < 31; i++) { // Generate predictions
        let prediction = {};
        prediction.temperature = i;
        let humidity = await getTemperatureHumidityPrediction([i]); // Get the prediction
        prediction.humidity = humidity['0'];
        predictions.push(prediction);
    }
    return predictions;
};
*/