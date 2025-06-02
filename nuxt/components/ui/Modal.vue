<script setup>
// Props
const props = defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: 'Error' },
    icon: { type: String, default: 'fa-solid fa-circle-exclamation' }
});

// Emits
const emit = defineEmits(['close']);

// Close modal function
const closeModal = () => {
    emit('close');
};
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-backdrop">
            <div v-if="props.visible" class="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm" @click="closeModal">
                <div class="flex min-h-screen items-center justify-center p-4">
                    <Transition name="modal-content">
                        <div v-if="props.visible" class="relative flex flex-col bg-white dark:bg-gray-800 shadow-2xl w-full h-auto rounded-2xl sm:max-w-lg" @click.stop> <!-- Header with icon and title -->
                            <div class="flex-none flex items-center py-6 px-6 border-b border-gray-200 dark:border-gray-700">
                                <div class="relative mr-4">
                                    <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25"></div>
                                    <div class="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                                        <i :class="[props.icon, 'text-white drop-shadow-sm', 'text-xl']"></i>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <h3 class="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent tracking-tight">{{ props.title }}</h3>
                                    <div class="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
                                </div>
                            </div>

                            <!-- Body with smooth scrolling -->
                            <div class="flex-1 p-6 overflow-y-auto max-h-136 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                <slot name="body"></slot>
                            </div>

                            <!-- Footer with elegant styling -->
                            <div class="flex-none flex justify-end items-center gap-x-3 py-4 px-6 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl border-t border-gray-200 dark:border-gray-700">
                                <slot name="footer"></slot>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Backdrop transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
    opacity: 0;
    backdrop-filter: blur(0px);
}

.modal-backdrop-enter-to,
.modal-backdrop-leave-from {
    opacity: 1;
    backdrop-filter: blur(4px);
}

/* Content transitions */
.modal-content-enter-active,
.modal-content-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-content-enter-from,
.modal-content-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
}

.modal-content-enter-to,
.modal-content-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* Custom scrollbar styles */
.scrollbar-thin {
    scrollbar-width: thin;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
    background-color: rgb(209 213 219);
    border-radius: 9999px;
}

.scrollbar-track-transparent::-webkit-scrollbar-track {
    background-color: transparent;
}

.dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
    background-color: rgb(75 85 99);
}

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgb(209 213 219);
    border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgb(156 163 175);
}

.dark ::-webkit-scrollbar-thumb {
    background: rgb(75 85 99);
}

.dark ::-webkit-scrollbar-thumb:hover {
    background: rgb(107 114 128);
}

/* Focus states for accessibility */
button:focus-visible {
    outline: 2px solid rgb(59 130 246);
    outline-offset: 2px;
}
</style>