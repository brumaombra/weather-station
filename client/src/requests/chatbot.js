import { api } from './main.js';

// Call the chatbot API to get a response
export const chatWithChatbot = async messages => {
    try {
        const { data } = await api.post('/api/chatbot/chat', { messages });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while getting the chatbot response');
    }
};

// Create the query from the question
export const createQueryFromQuestion = async messages => {
    try {
        const { data } = await api.post('/api/chatbot/query', { messages });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while creating the query');
    }
};