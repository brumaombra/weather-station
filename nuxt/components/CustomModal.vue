<script setup>
// Props
const props = defineProps({
    visible: { type: Boolean, default: false },
    title: { type: String, default: 'Error' },
    icon: { type: String, default: 'fa-solid fa-circle-exclamation' }
});
</script>

<template>
    <Transition name="modal-fade">
        <div v-if="props.visible" class="fixed inset-0 z-[80] overflow-hidden bg-gray-900/50">
            <div class="flex min-h-screen items-center justify-center p-0 sm:p-4">
                <div class="relative flex flex-col bg-white overflow-hidden w-full h-screen sm:h-auto sm:rounded-xl sm:max-w-xl">
                    <!-- Title - fixed at top -->
                    <div class="flex-none flex items-center py-4 px-4">
                        <i :class="['me-2 dark:text-neutral-200', props.icon]"></i>
                        <h3 class="font-bold text-gray-800 dark:text-neutral-200">{{ props.title }}</h3>
                    </div>

                    <!-- Body - fills available space -->
                    <div class="flex-1 p-6 overflow-y-auto">
                        <slot name="body"></slot>
                    </div>

                    <!-- Footer - fixed at bottom -->
                    <div class="flex-none flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 dark:bg-neutral-800">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
</style>