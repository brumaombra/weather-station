<script setup>
import { ref, computed, watch } from 'vue';

// Props and emits
const props = defineProps({
    visible: { type: Boolean, default: false },
    messages: { type: Array, default: [] },
    aiIsThinking: { type: Boolean, default: false }
});
const emit = defineEmits(['update:visible', 'update:messages']);

// Watch for changes in messages and scroll to the bottom
watch(() => props.messages, () => {
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
}, { deep: true });

// View properties
const isFormValid = computed(() => inputText.value.trim().length > 0 && !props.aiIsThinking);
const inputText = ref('');
const chatContainer = ref(null); // Chat container reference

// Handle close chat press
const handleCloseChatPress = () => {
    emit('update:visible', false);
};

// Handle form submission
const handleFormSubmit = event => {
    event.preventDefault(); // Prevent form submission

    // Create a new message
    const newMessage = {
        id: Date.now(),
        type: 'user',
        message: inputText.value
    };

    // Append message and send it to the father
    const updatedMessages = [...props.messages, newMessage];
    emit('update:messages', updatedMessages);
    inputText.value = '';
};
</script>

<template>
    <div class="chatbot-container flex flex-col h-full">
        <!-- Heading -->
        <div class="flex justify-between items-center mb-4">
            <!-- Chatbot Title -->
            <h2 class="font-bold text-lg">Chatbot</h2>

            <!-- Close Button -->
            <button @click="handleCloseChatPress">
                <i class="fas fa-times fa-lg"></i>
            </button>
        </div>

        <!-- Chat Container -->
        <div ref="chatContainer" class="pr-4 flex-grow overflow-y-auto">
            <!-- Chat Messages -->
            <div class="flex gap-3 my-4 text-gray-600 text-sm" v-for="message in props.messages" :key="message.id">
                <div
                    class="flex-shrink-0 relative flex items-center justify-center rounded-full bg-gray-100 border profile-picture">
                    <i class="fas fa-robot fa-lg" v-if="message.type === 'assistant'"></i>
                    <i class="fas fa-user fa-lg" v-else></i>
                </div>
                <p class="leading-relaxed flex-grow">
                    <span class="block font-bold text-gray-700">{{ message.type === 'assistant' ? 'Assistant' : 'You' }}</span>
                    {{ message.message }}
                </p>
            </div>

            <!-- AI Is Thinking Message -->
            <div class="flex gap-3 my-4 text-gray-600 text-sm" v-if="props.aiIsThinking">
                <div class="relative flex items-center justify-center rounded-full bg-gray-100 border profile-picture">
                    <i class="fas fa-robot fa-lg"></i>
                </div>
                <p class="leading-relaxed">
                    <span class="block font-bold text-gray-700">Assistant</span>
                    I'm thinking about your request...
                </p>
            </div>
        </div>

        <!-- Input Box -->
        <div class="flex items-center mt-5">
            <form class="flex items-center justify-center w-full space-x-2" @submit="handleFormSubmit">
                <input v-model="inputText"
                    class="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                    placeholder="Type your message">
                <button :disabled="!isFormValid"
                    class="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2">
                    Send
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.chatbot-container {
    position: fixed;
    bottom: 4.5rem;
    right: 4.5rem;
    background-color: white;
    padding: 1.5rem;
    border-radius: 1rem;
    border: 1px solid #e5e7eb;
    width: 440px;
    height: 634px;
    z-index: 999;
    display: flex;
    flex-direction: column;
}

.profile-picture {
    width: 50px;
    height: 50px;
}

/* Desktop */
@media (max-width: 640px) {
    .chatbot-container {
        width: 100%;
        height: 100%;
        border-radius: 0;
        bottom: 0;
        right: 0;
    }
}
</style>