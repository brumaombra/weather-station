import * as tf from '@tensorflow/tfjs';

// Split data into training and testing
const splitData = (data, labels, testRatio) => {
    const numTestExamples = Math.floor(data.length * testRatio);
    const numTrainExamples = data.length - numTestExamples;
    const X_train = data.slice(0, numTrainExamples);
    const X_test = data.slice(numTrainExamples);
    const y_train = labels.slice(0, numTrainExamples);
    const y_test = labels.slice(numTrainExamples);
    return { X_train, X_test, y_train, y_test };
};

// Calculate mean and variance using TensorFlow.js operations
const meanAndVariance = tensor => {
    const mean = tensor.mean();
    const variance = tensor.sub(mean).square().mean(); // Calculate variance
    return { mean, variance };
};

// Predict using a trained model and compute bias and variance
const predictAndEvaluate = (model, X_test, y_test) => {
    const predictions = model.predict(X_test); // Predict the output
    const errors = predictions.sub(y_test).reshape([-1]); // Ensure it's a 1D tensor for further calculations
    const { mean: bias, variance } = meanAndVariance(errors); // Calculate bias (mean error) and variance
    return { bias: bias.arraySync(), variance: variance.arraySync() };
};

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
export const trainModelRegression = async (X_dataset, y_dataset, polynomialDegree = 1) => {
    try {
        if (!X_dataset || !y_dataset) throw new Error('Missing training data'); // Check the input values
        if (!Array.isArray(X_dataset) || !Array.isArray(y_dataset)) throw new Error('Input data must be arrays');
        if (X_dataset.length === 0 || y_dataset.length === 0) throw new Error('Input data must not be empty');
        if (X_dataset.length !== y_dataset.length) throw new Error('Input data must have the same length');

        // Split the data (Training set and test set)
        const { X_train, X_test, y_train, y_test } = splitData(X_dataset, y_dataset, 0.3);

        // Creat the training tensors
        const xInputShape = X_train[0]?.length || 1;
        const yInputShape = y_train[0]?.length || 1;
        const xsTrain = tf.tensor2d(X_train, [X_train.length, xInputShape]); // Convert the training data to a tensor
        const ysTrain = tf.tensor2d(y_train, [y_train.length, yInputShape]); // Convert the labels to a tensor
        const xsTrainPolynomial = generatePolynomialFeatures(xsTrain, polynomialDegree);
        const { normalized: xsTrainNormalized, mean: X_mean, std: X_std } = normalizeData(xsTrainPolynomial); // Normalize the data

        // Create the model
        const model = tf.sequential(); // Create a sequential model
        model.add(tf.layers.dense({ units: 50, activation: 'relu', inputShape: [xsTrainNormalized.shape[1]] }));
        model.add(tf.layers.dense({ units: 25, activation: 'relu' }));
        model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
        model.compile({ optimizer: 'adam', loss: 'meanSquaredError', metrics: [tf.metrics.meanSquaredError] }); // Compile the model with the specified parameters

        // Train the model
        console.log('Training the model...');
        await model.fit(xsTrainNormalized, ysTrain, { epochs: 50, verbose: 0 }); // Train the model for 10 epochs
        console.log('Model trained successfully!');

        // Create the test tensors
        const xsTest = tf.tensor2d(X_test, [X_test.length, xInputShape]); // Convert the test data to a tensor
        const ysTest = tf.tensor2d(y_test, [y_test.length, yInputShape]); // Convert the labels to a tensor
        const xsTestPolynomial = generatePolynomialFeatures(xsTest, polynomialDegree);
        const { normalized: xsTestNormalized } = normalizeData(xsTestPolynomial, X_mean, X_std); // Normalize the data

        // Evaluate the model
        console.log('Evaluating the model...');
        const { bias, variance } = predictAndEvaluate(model, xsTestNormalized, ysTest); // Get the mean and variance of the model
        console.log(`Bias: ${bias}, Variance: ${variance}`);

        // Return the trained model and the normalization parameters
        return { model, X_mean, X_std };
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