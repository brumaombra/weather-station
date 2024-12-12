import express from 'express';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config(); // Load the .env file

const router = express.Router();
const groqApiKey = process.env.GROQ_API_KEY; // Get the GROQ API key from the environment variables
const groq = new Groq({ apiKey: groqApiKey }); // Create a new GROQ instance

// Ask the chatbot
router.post('/', async (req, res) => {
    try {
        const messages = req.body.messages; // Get the message from the request body

        // Call the GROQ API
        const response = await getChatbotResponse(messages);
        const responseMessage = response.choices[0]?.message?.content || ""; // Get the response message
        res.json({ message: responseMessage }); // Send the response
    } catch (error) {
        const errorMessage = 'Error while asking the chatbot';
        console.error(errorMessage, error); // Log the error
        res.status(500).json({ message: errorMessage }); // Send the error message with status
    }
});

// Get the chatbot response
const getChatbotResponse = async messages => {
    return groq.chat.completions.create({
        messages: messages.map(msg => ({
            role: msg.type,
            content: msg.message,
        })),
        model: "llama3-8b-8192"
    });
};

export default router;