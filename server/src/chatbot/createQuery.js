import { sendChatToGroq } from './main.js';
import { readFile } from '../utils/utils.js';
import { executeRawQuery } from '../db/connection.js';
import { isSelectQuery } from '../utils/utils.js';

// Create the query from the question
export const createQuery = async messages => {
    try {
        // Load the prompt from the file
        const prompt = await readFile(import.meta.url, './prompts/createQuery.txt');

        // Add the question to the prompt
        const updatedMessages = [...messages];
        const userQuestion = updatedMessages[updatedMessages.length - 1].message; // Get the question from the last message
        const promptWithQuestion = prompt.replace('{userQuestion}', userQuestion); // Replace the placeholder with the question
        updatedMessages[updatedMessages.length - 1].message = promptWithQuestion; // Update the last message

        // Send the chat to the GROQ API
        const responseMessage = await sendChatToGroq(updatedMessages, { responseFormat: 'json_object' });
        if (!responseMessage) { // Check if the response message is valid
            throw new Error('Error while creating the query');
        }

        // Parse the response
        const parsedResponse = JSON.parse(responseMessage);
        if (parsedResponse.error) {
            return parsedResponse.error || 'The request could not be processed, please ask another question';
        }

        // Check if the response has the SQL query
        if (!parsedResponse.sql) {
            throw new Error('Error while creating the query');
        }

        // Check if the query is a SELECT query
        console.log(parsedResponse.sql); // Log the query
        if (!isSelectQuery(parsedResponse.sql)) {
            throw new Error('The query is not a SELECT query');
        }

        // Execute the query
        const queryResponse = await executeRawQuery(parsedResponse.sql);
        const queryResult = queryResponse[0];
        if (!queryResult) {
            throw new Error('Error while creating the query');
        }

        // Create the text summary
        const textSummary = await createTextSummary(queryResult, userQuestion);
        if (!textSummary) {
            throw new Error('Error while creating the text summary');
        }

        // Return the query response
        return textSummary;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while creating the query');
    }
};

// Create text summary based on the query result using GROQ
export const createTextSummary = async (queryResult, userQuestion) => {
    try {
        // Validate the parameters
        if (!queryResult || !Array.isArray(queryResult) || queryResult.length === 0 || !userQuestion) {
            throw new Error('Invalid parameters');
        }

        // Load the prompt from the file
        const prompt = await readFile(import.meta.url, './prompts/createQueryTextSummary.txt');
        const promptWithQuestion = prompt.replace('{userQuestion}', userQuestion); // Replace the placeholder with the question
        const promptWithResult = promptWithQuestion.replace('{queryResult}', JSON.stringify(queryResult)); // Replace the placeholder with the query result

        // Send the chat to the GROQ API
        const textSummary = await sendChatToGroq([{ type: 'user', message: promptWithResult }]);
        return textSummary;
    } catch (error) {
        console.error(error);
        throw new Error('Error while creating the text summary');
    }
};