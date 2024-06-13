import * as tf from '@tensorflow/tfjs';
import { getMeasurements } from '../db/sql.js';

let trainedModel;

// Create the model
const createModel = inputShape => {
    const model = tf.sequential();

    // Encoder and decoder layers
    model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: inputShape }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 4, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    model.add(tf.layers.dense({ units: inputShape, activation: 'tanh' }));
    return model
};

// Z-Score normalization
const zScoreNormalize = tensor => {
    const mean = tensor.mean();
    const std = tensor.sub(mean).square().mean().sqrt();
    const normalizedTensor = tensor.sub(mean).div(std);
    return normalizedTensor;
};

// Format the data
const formatData = data => {
    const XData = data.map(item => [ // Format the data
        item.temperature,
        item.humidity,
        item.pressure,
        item.gas,
        item.pm1,
        item.pm25,
        item.pm10
    ]);

    // Create the tensor and normalize the data
    const X = tf.tensor2d(XData);
    const XNorm = zScoreNormalize(X); // Normalize the data
    return { XNorm, inputShape: X.shape[1] };
};

// Split the data into training and test sets
const spitData = (X, trainPercentage = 0.8) => {
    const trainSize = Math.floor(X.shape[0] * trainPercentage); // Calculate the training size (80%)
    const XTrain = X.slice(0, trainSize); // Create the train set
    const XTest = X.slice(trainSize); // Create the test set
    return { XTrain, XTest };
};

// Format and split data
const formatAndSplitData = data => {
    if (!data) throw new Error('Data not provided');
    const { XNorm, inputShape } = formatData(data); // Format the data
    const { XTrain, XTest } = spitData(XNorm, 0.8); // Spit the data
    return { XTrain, XTest, inputShape: inputShape };
};

// Train the model
export const trainModel = async () => {
    const measurements = await getMeasurements(); // Get the measurements from the database
    if (!measurements?.results?.length > 0) throw new Error('Measurements not found'); // Check if the measurements are found
    const { XTrain, XTest, inputShape } = formatAndSplitData(measurements.results); // Format the training data and the labels
    const model = createModel(inputShape); // Create the model
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['accuracy'] }); // Compile the model
    await model.fit(XTrain, XTrain, { // Train the model
        epochs: 25,
        batchSize: 64,
        shuffle: false,
        validationData: [XTest, XTest],
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
            }
        }
    });
    trainedModel = model; // Save the model
};

// Detect the anomaly
export const detectAnomaly = data => {
    if (!trainedModel) throw new Error('Model not trained');
    if (!data) throw new Error('Data not provided');
    const XTest = formatData(data).XNorm; // Format the data
    const reconstructed = trainedModel.predict(XTest);
    const error = tf.losses.meanSquaredError(XTest, reconstructed); // Calculate the mean squared error
    error.print(); // Print the reconstruction error
    return error.dataSync()[0]; // Return the first element of the error array
};