<script setup>
import CorrelationsStore from '@/stores/correlations.js';

// View model
const viewModel = CorrelationsStore;

// Events list
const emit = defineEmits(['apply']);
</script>

<template>
    <div id="filterModal" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden dark:bg-neutral-800 dark:border-neutral-500">
                <!-- Title -->
                <div class="flex items-center py-4 px-4 border-b dark:border-neutral-500">
                    <i class="fa-solid fa-filter me-2 dark:text-neutral-200"></i>
                    <h3 class="font-bold text-gray-800 dark:text-neutral-200">Filter</h3>
                </div>

                <!-- Content -->
                <div class="p-6 overflow-y-auto">
                    <div class="space-y-4">
                        <form>
                            <!-- Start date -->
                            <div class="mb-4 sm:mb-5">
                                <label class="block mb-2 text-sm font-medium dark:text-neutral-200">Start date</label>
                                <input type="date" v-model="viewModel.dialogFilter.startDate" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-500 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>

                            <!-- End date -->
                            <div>
                                <label class="block mb-2 text-sm font-medium dark:text-neutral-200">End date</label>
                                <input type="date" v-model="viewModel.dialogFilter.endDate" class="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-500 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600">
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t dark:bg-neutral-800 dark:border-neutral-500">
                    <button type="button" data-hs-overlay="#filterModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:text-white dark:hover:bg-neutral-800">
                        Cancel
                    </button>
                    <button type="button" data-hs-overlay="#filterModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" @click="emit('apply')">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>