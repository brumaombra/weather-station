import * as tf from '@tensorflow/tfjs';

// Normalize the data
const normalizeData = (data, mean = null, std = null) => {
    mean = mean || data.mean(0); // Calculate the mean if not provided
    if (!std) { // Calculate the standard deviation if not provided
        const squaredDiff = data.sub(mean).square();
        std = squaredDiff.mean(0).sqrt();
    }
    return {
        normalized: data.sub(mean).div(std),
        mean: mean,
        std: std
    };
};

// Train the model for regression
export const trainModelRegression = async (X_train, y_train) => {
    try {
        if (!X_train || !y_train) throw new Error('Missing training data'); // Check the input values
        if (!Array.isArray(X_train) || !X_train.every(item => Array.isArray(item))) throw new Error('X_train must be an array of arrays');
        if (!Array.isArray(y_train)) throw new Error('y_train must be an array');

        // Create and train the model
        const model = tf.sequential(); // Create a sequential model
        model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [X_train[0].length] }));
        model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'relu' }));
        model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: ['accuracy'] }); // Compile the model with the specified parameters
        const xs = tf.tensor2d(X_train); // Convert the training data to a tensor
        const ys = tf.tensor2d(y_train, [y_train.length, 1]); // Convert the labels to a tensor
        const { normalized: xs_normalized, mean: X_mean, std: X_std } = normalizeData(xs); // Normalize the data
        await model.fit(xs_normalized, ys, { epochs: 10 }); // Train the model for 10 epochs
        return { model, X_mean, X_std }; // Return the trained model and the normalization parameters
    } catch (error) {
        const newError = new Error('Error while training the model', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the prediction
export const getPrediction = async (model, X_test, X_mean, X_std) => {
    try {
        const xs = tf.tensor2d(X_test); // Convert the test data to a tensor
        const { normalized: xs_normalized } = normalizeData(xs, X_mean, X_std); // Normalize the test data
        const prediction = await model.predict(xs_normalized); // Make a prediction
        const result = await prediction.dataSync(); // Get the prediction result
        return result;
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};