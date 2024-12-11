<script setup>
import { ref } from 'vue';
import Chat from './Chat.vue';

// Chat visibility
const chatVisible = ref(false);

// Chatbot button click event
const handleChatbotClick = () => {
    chatVisible.value = !chatVisible.value;
};
</script>

<template>
    <div>
        <!-- Chatbot Button -->
        <button class="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
            type="button" aria-haspopup="dialog" aria-expanded="false" data-state="closed" @click="handleChatbotClick">
            <i class="fas fa-comment-dots fa-lg text-white"></i>
        </button>

        <!-- Chat -->
        <Chat v-if="chatVisible" v-model:visible="chatVisible" :messages="[]" />
    </div>
</template>