import * as tf from '@tensorflow/tfjs';
import { getMeasurements } from '../db/sql.js';

let modelPm25Prediction = null;

// Train the model
const trainModel = async (X_train, y_train) => {
    try {
        if (!X_train || !y_train) throw new Error('Missing training data'); // Check the input values
        if (!Array.isArray(X_train) || !X_train.every(item => Array.isArray(item))) throw new Error('X_train must be an array of arrays');
        if (!Array.isArray(y_train)) throw new Error('y_train must be an array');

        // Create and train the model
        const model = tf.sequential(); // Create a sequential model
        model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [X_train[0].length] }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
        model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] }); // Compile the model with the specified parameters
        const xs = tf.tensor2d(X_train); // Convert the training data to a tensor
        const ys = tf.tensor2d(y_train, [y_train.length, 1]); // Convert the labels to a tensor
        await model.fit(xs, ys, { epochs: 10 }); // Train the model for 10 epochs
        return model; // Return the trained model
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Train the PM2.5 model
export const trainPm25Model = async () => {
    try {
        const measurements = await getMeasurements(); // Get the measurements from the database
        const X_train = measurements.results.map(item => [ // Create the training data
            item.temperature,
            item.humidity,
            item.pressure,
            item.gas,
            item.pm10
        ]);
        const y_train = measurements.results.map(item => item.pm25); // Create the labels
        console.log('Training the model...');
        modelPm25Prediction = await trainModel(X_train, y_train);
        console.log('Model trained');
    } catch (error) {
        const newError = new Error('Error while training the model', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the PM2.5 prediction
export const getPm25Prediction = async X_test => {
    try {
        const xs = tf.tensor2d(X_test); // Convert the data to a tensor
        const prediction = modelPm25Prediction.predict(xs); // Make a prediction
        return prediction.dataSync(); // Return the prediction
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};