import { trainModelRegression, getPrediction } from "./ml.js";
import { getMeasurements } from '../db/sql.js';

const polynomialDegree = 1;
let temperatureHumidityPredictionModel = null;
let temperatureHumidityPredictionMean = null;
let temperatureHumidityPredictionStd = null;

// Format the training data
const formatTrainingData = data => {
    const x_train = data.map(item => item.temperature);
    const y_train = data.map(item => item.humidity);
    return { x_train, y_train };
};

// Train the model
export const trainTemperatureHumidityModel = async () => {
    try {
        const measurements = await getMeasurements(); // Get the measurements from the database
        if (!measurements) throw new Error('Measurements not found'); // Check if the measurements are found
        const { x_train, y_train } = formatTrainingData(measurements.results); // Format the training data and the labels
        const temperatureHumidityPrediction = await trainModelRegression(x_train, y_train, polynomialDegree); // Train the model
        temperatureHumidityPredictionModel = temperatureHumidityPrediction.model; // Save the trained model
        temperatureHumidityPredictionMean = temperatureHumidityPrediction.X_mean; // Save the normalization parameters
        temperatureHumidityPredictionStd = temperatureHumidityPrediction.X_std; // Save the normalization parameters
    } catch (error) {
        const newError = new Error('Error while training the model', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the prediction
export const getTemperatureHumidityPrediction = async x_test => {
    try {
        if (!x_test) throw new Error('Input data is required'); // Check if the input data is provided
        if (!temperatureHumidityPredictionModel) await trainTemperatureHumidityModel(); // Train the model if it is not trained
        const prediction = await getPrediction(temperatureHumidityPredictionModel, x_test, temperatureHumidityPredictionMean, temperatureHumidityPredictionStd, polynomialDegree); // Get the prediction
        return prediction; // Return the prediction
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Generate predictions for up to 30 degrees
export const createTempHumCorrelationData = async () => {
    let predictions = [];
    for (let i = 0; i < 31; i++) { // Generate predictions for up to 30 degrees
        let prediction = {};
        prediction.temperature = i;
        let humidity = await getTemperatureHumidityPrediction([i]); // Get the prediction
        prediction.humidity = humidity['0'];
        predictions.push(prediction);
    }
    return predictions;
};