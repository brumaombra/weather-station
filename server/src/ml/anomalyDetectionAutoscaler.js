import * as tf from '@tensorflow/tfjs';
import { getMeasurements, updateMeasurement } from '../db/sql.js';

let trainedModel;

// Create the model
const createModel = inputShape => {
    return tf.sequential({
        layers: [ // Encoder and decoder layers
            tf.layers.dense({ units: 16, activation: 'relu', inputShape: inputShape }),
            tf.layers.dense({ units: 8, activation: 'relu' }),
            tf.layers.dense({ units: 4, activation: 'relu' }),
            tf.layers.dense({ units: 8, activation: 'relu' }),
            tf.layers.dense({ units: 16, activation: 'relu' }),
            tf.layers.dense({ units: inputShape, activation: 'tanh' })
        ]
    });
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
const trainModel = async measurements => {
    if (!measurements) throw new Error('Measurements not provided'); // Check if the measurements are provided
    const { XTrain, XTest, inputShape } = formatAndSplitData(measurements); // Format the training data and the labels
    const model = createModel(inputShape); // Create the model
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['accuracy'] }); // Compile the model
    await model.fit(XTrain, XTrain, { // Train the model
        epochs: 50,
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

// Calculate the percentile
const percentile = (arr, p) => {
    const sorted = arr.slice().sort((a, b) => a - b);
    const pos = (sorted.length - 1) * p / 100;
    const base = Math.floor(pos);
    const rest = pos - base;
    return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
};

// Mark the anomalies on the DB
const markAnomalies = async measurements => {
    if (!trainedModel) throw new Error('Model not trained');
    if (!measurements) throw new Error('Measurements not provided'); // Check if the measurements are provided
    const XTest = formatData(measurements).XNorm; // Format the data
    const reconstructed = trainedModel.predict(XTest); // Calculate reconstruction errors
    const reconstructionErrors = XTest.sub(reconstructed).square().mean(1);
    const errorsArray = await reconstructionErrors.data();
    const threshold = percentile(errorsArray, 95); // Get the percentile

    // Identify anomalies based on the threshold
    for (const [index, error] of errorsArray.entries()) {
        const isAnomaly = error > threshold;
        const id = measurements[index].id;
        await updateMeasurement(id, { anomaly: isAnomaly });
    }
};

// Train the model and mark the anomalies
export const trainAndMarkAnomalies = async () => {
    const measurements = await getMeasurements(); // Get the measurements from the database
    if (!measurements?.results?.length > 0) throw new Error('Measurements not found');
    if (measurements.length % 24 === 0) { // Every 24 measurements
        await trainModel(measurements.results); // Train the model
        await markAnomalies(measurements.results); // Mark the anomalies
    }
};