<script setup>
import { formatTimestamp } from '~/utils/formatter.js';
import CustomButton from '~/components/CustomButton.vue';
import CustomModal from '~/components/CustomModal.vue';

// Props
const props = defineProps({
    visible: { type: Boolean, required: true },
    inputs: { type: Object, default: {} }
});

// Emits
const emits = defineEmits(['save', 'update:visible']);

// Handle close press
const handleClosePress = () => {
    emits('update:visible', false);
};

// Handle save press
const handleSavePress = () => {
    emits('save', props.inputs);
    emits('update:visible', false);
};
</script>

<template>
    <CustomModal :visible="props.visible" title="Edit" icon="fa-solid fa-edit">
        <!-- Body -->
        <template #body>
            <div>
                <form class="space-y-4">
                    <!-- Timestamp -->
                    <div class="mb-4 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">Timestamp</label>
                        <p>{{ formatTimestamp(props.timestamp) }}</p>
                    </div>

                    <!-- Temperature -->
                    <div class="mb-2 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">Temperature</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.temperature" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">°C</span>
                            </span>
                        </div>
                    </div>

                    <!-- Humidity -->
                    <div class="mb-2 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">Humidity</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.humidity" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">%</span>
                            </span>
                        </div>
                    </div>

                    <!-- Pressure -->
                    <div class="mb-2 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">Pressure</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.pressure" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">hPa</span>
                            </span>
                        </div>
                    </div>

                    <!-- Gas -->
                    <div class="mb-2 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">Gas</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.gas" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">kOhm</span>
                            </span>
                        </div>
                    </div>

                    <!-- PM1 -->
                    <div class="mb-2 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">PM1</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.pm1" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">µg/m³</span>
                            </span>
                        </div>
                    </div>

                    <!-- PM2.5 -->
                    <div class="mb-2 sm:mb-5">
                        <label class="block mb-2 text-sm font-medium dark:text-white">PM2.5</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.pm25" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">µg/m³</span>
                            </span>
                        </div>
                    </div>

                    <!-- PM10 -->
                    <div class="mb-2 sm:mb-2">
                        <label class="block mb-2 text-sm font-medium dark:text-white">PM10</label>
                        <div class="flex">
                            <input type="number" v-model="props.inputs.pm10" class="py-3 px-4 block w-full border border-gray-200 rounded-l-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            <span class="px-4 inline-flex items-center min-w-fit rounded-e-lg border border-s-0 border-gray-200 bg-gray-50 text-sm dark:bg-neutral-700 dark:border-neutral-700">
                                <span class="text-sm text-gray-500 dark:text-neutral-400">µg/m³</span>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </template>

        <!-- Footer -->
        <template #footer>
            <CustomButton type="secondary" text="Cancel" icon="fa-solid fa-times" @click="handleClosePress" />
            <CustomButton type="primary" text="Save" icon="fa-solid fa-check" @click="handleSavePress" />
        </template>
    </CustomModal>
</template>