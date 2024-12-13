import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config(); // Load the .env file

const groqApiKey = process.env.GROQ_API_KEY; // Get the GROQ API key from the environment variables
const groq = new Groq({ apiKey: groqApiKey }); // Create a new GROQ instance
const defaultModel = "llama3-8b-8192"; // Set the model ID

// Send the chat messages to the GROQ API
export const sendChatToGroq = async (messages, options) => {
    const { model = defaultModel, responseFormat = 'text' } = options || {};

    // Call the GROQ API
    const response = await groq.chat.completions.create({
        messages: messages.map(msg => ({
            role: msg.type,
            content: msg.message,
        })),
        model: model, // The LLM model to use
        response_format: { type: responseFormat } // The response format
    });

    // Return the response
    const responseMessage = response.choices[0]?.message?.content || ""; // Get the response message
    return responseMessage;
};

// Get the models from the GROQ API
export const getModels = async () => {
    return await groq.models.list();
};