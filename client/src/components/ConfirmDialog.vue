<script setup>
// Props
const props = defineProps({
    id: { type: String, default: "confirmDialog" },
    title: { type: String, default: "Confirm" },
    message: { type: String, default: "Confirm?" }
});

// Events list
const emit = defineEmits(['confirm']);
</script>

<template>
    <div :id="props.id" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
                <div class="p-4 sm:p-10 overflow-y-auto">
                    <!-- Title -->
                    <div class="mb-6 text-center">
                        <h3 class="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">{{ props.title }}</h3>
                    </div>

                    <!-- Content -->
                    <div class="space-y-4">
                        <p>{{ props.message }}</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-neutral-950 dark:border-neutral-800">
                    <button type="button" :data-hs-overlay="`#${props.id}`" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800">
                        Cancel
                    </button>
                    <button type="button" :data-hs-overlay="`#${props.id}`" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" @click="emit('confirm')">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>