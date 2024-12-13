import express from 'express';
import { sendChatToGroq } from '../../chatbot/main.js';
import { createQuery } from '../../chatbot/createQuery.js';

const router = express.Router();

// Ask the chatbot
router.post('/chat', async (req, res) => {
    try {
        const messages = req.body.messages; // Get the message from the request body
        if (!messages || !Array.isArray(messages) || messages.length === 0) { // Check if the messages are valid
            return res.status(400).json({ message: 'Invalid messages' }); // Send the error message with status
        }

        // Call the GROQ API
        const response = await sendChatToGroq(messages);
        res.json({ message: response }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while asking the chatbot';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Create a query
router.post('/query', async (req, res) => {
    try {
        const messages = req.body.messages; // Get the query from the request body
        if (!messages || !Array.isArray(messages) || messages.length === 0) { // Check if the messages are valid
            return res.status(400).json({ message: 'Invalid messages' }); // Send the error message with status
        }

        // Call the GROQ API
        const response = await createQuery(messages);
        res.json({ message: response }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while creating the query';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

export default router;