import { executePython } from "../utils/utils.js";

// Get prediction from python script
export const getPrediction = async () => {
    try {
        const prediction = await executePython('src/python/test.py'); // Execute the script
        return prediction; // Return the prediction
    } catch (error) {
        const newError = new Error('Error while getting the prediction', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};