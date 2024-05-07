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

// Generate polynomial features
const generatePolynomialFeatures = (inputTensor, degree) => {
    if (inputTensor.rank !== 2) throw new Error('Input tensor must be a 2D matrix.');
    const features = [];
    for (let i = 1; i <= degree; i++) {
        const power = inputTensor.pow(tf.scalar(i, 'int32'));
        features.push(power);
    }
    const polynomialTensor = tf.concat(features, 1);
    return polynomialTensor;
};

// Train the model for regression
export const trainModelRegression = async (X_train, y_train, polynomialDegree = 1) => {
    try {
        if (!X_train || !y_train) throw new Error('Missing training data'); // Check the input values
        if (!Array.isArray(X_train) || !Array.isArray(y_train)) throw new Error('Input data must be arrays');
        if (X_train.length === 0 || y_train.length === 0) throw new Error('Input data must not be empty');
        if (X_train.length !== y_train.length) throw new Error('Input data must have the same length');

        // Creat the tensors
        const xInputShape = X_train[0]?.length || 1;
        const yInputShape = y_train[0]?.length || 1;
        const xs = tf.tensor2d(X_train, [X_train.length, xInputShape]); // Convert the training data to a tensor
        const ys = tf.tensor2d(y_train, [y_train.length, yInputShape]); // Convert the labels to a tensor
        const xsPolynomial = generatePolynomialFeatures(xs, polynomialDegree);
        const { normalized: xs_normalized, mean: X_mean, std: X_std } = normalizeData(xsPolynomial); // Normalize the data

        // Create and train the model
        const model = tf.sequential(); // Create a sequential model
        model.add(tf.layers.dense({ units: 50, activation: 'relu', inputShape: [xs_normalized.shape[1]] }));
        model.add(tf.layers.dense({ units: 25, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
        model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: [tf.metrics.meanSquaredError] }); // Compile the model with the specified parameters
        console.log('Training the model...');
        await model.fit(xs_normalized, ys, { epochs: 100, verbose: 0 }); // Train the model for 10 epochs
        console.log('Model trained successfully!');
        return { model, X_mean, X_std }; // Return the trained model and the normalization parameters
    } catch (error) {
        const newError = new Error('Error while training the model', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the prediction
export const getPrediction = async (model, X_test, X_mean, X_std, polynomialDegree = 1) => {
    try {
        if (!model || !X_test || !X_mean || !X_std) throw new Error('Input data is required'); // Check the input values
        const xInputShape = X_test[0]?.length || 1;
        const xs = tf.tensor2d(X_test, [X_test.length, xInputShape]); // Convert the test set to a tensor
        const xsPolynomial = generatePolynomialFeatures(xs, polynomialDegree);
        const { normalized: xs_normalized } = normalizeData(xsPolynomial, X_mean, X_std); // Normalize the test data
        const prediction = await model.predict(xs_normalized); // Make a prediction
        const result = await prediction.data(); // Get the prediction result
        return result;
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};