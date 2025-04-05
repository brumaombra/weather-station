<script setup>
import { ref } from 'vue';
import { createQueryFromQuestion } from '~/requests/chatbot.js';
import Chat from './Chat.vue';

// Chat visibility
const chatVisible = ref(false);
const chatMessages = ref([{
    id: Date.now(),
    type: 'assistant',
    message: 'Hi, how can I help you today?'
}]);
const aiIsThinking = ref(false); // If Ai is elaborating a response

// Chatbot button click event
const handleChatbotClick = () => {
    chatVisible.value = !chatVisible.value;
};

// Handler for updating messages
const updateMessages = async newMessages => {
    chatMessages.value = newMessages; // Update the messages
    const lastMessages = chatMessages.value.slice(-10); // Get the last 10 messagges
    await callChatbot(lastMessages); // Call the API
};

// Call the API to get the chatbot response
const callChatbot = async messages => {
    try {
        if (!messages) return; // If the message is empty, return
        aiIsThinking.value = true; // Ai is thinking

        // Call the API
        const response = await createQueryFromQuestion(messages); // Call the API

        // Create a new message
        const newMessage = {
            id: Date.now(),
            type: 'assistant',
            message: response.message
        };

        // Append the new message
        chatMessages.value = [...chatMessages.value, newMessage];
        aiIsThinking.value = false; // Ai has finished thinking
    } catch (error) {
        console.error(error); // Log the error
        aiIsThinking.value = false; // Ai has finished thinking
    }
};
</script>

<template>
    <div>
        <!-- Chatbot Button -->
        <button
            class="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
            type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed" @click="handleChatbotClick">
            <i class="fas fa-comment-dots fa-lg text-white"></i>
        </button>

        <!-- Chat -->
        <Chat v-if="chatVisible" v-model:visible="chatVisible" :messages="chatMessages"
            @update:messages="updateMessages" :ai-is-thinking="aiIsThinking" />
    </div>
</template>