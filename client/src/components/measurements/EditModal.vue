<script setup>
import MeasurementsStore from '@/stores/measurements.js';
import { formatTimestamp } from '@/utils/formatter.js';

// View model
const viewModel = MeasurementsStore;

// Events list
const emit = defineEmits(['save']);
</script>

<template>
    <div id="editModal" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-neutral-900 dark:border-neutral-800">
                <div class="p-4 sm:p-10 overflow-y-auto">
                    <!-- Title -->
                    <div class="mb-6 text-center">
                        <h3 class="mb-2 text-xl font-bold text-gray-800 dark:text-neutral-200">Filter</h3>
                        <p class="text-gray-500 dark:text-neutral-500">Filter and order the measurements</p>
                    </div>

                    <!-- Content -->
                    <div class="space-y-4">
                        <form>
                            <!-- Timestamp -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">Timestamp</label>
                                <p>{{ formatTimestamp(viewModel.tempMeasurement.timestamp) }}</p>
                            </div>

                            <!-- Temperature -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">Temperature</label>
                                <input type="number" v-model="viewModel.tempMeasurement.timestamp" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- Humidity -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">Humidity</label>
                                <input type="number" v-model="viewModel.tempMeasurement.humidity" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- Pressure -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">Pressure</label>
                                <input type="number" v-model="viewModel.tempMeasurement.pressure" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- Gas -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">Gas</label>
                                <input type="number" v-model="viewModel.tempMeasurement.gas" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- PM1 -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">PM1</label>
                                <input type="number" v-model="viewModel.tempMeasurement.pm1" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- PM2.5 -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">PM2.5</label>
                                <input type="number" v-model="viewModel.tempMeasurement.pm25" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- PM10 -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-white">PM10</label>
                                <input type="number" v-model="viewModel.tempMeasurement.pm10" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-neutral-950 dark:border-neutral-800">
                    <button type="button" data-hs-overlay="#editModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800">
                        Cancel
                    </button>
                    <button type="button" data-hs-overlay="#editModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" @click="emit('save')">
                        Save
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>