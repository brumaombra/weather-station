<script setup>
import FilterModal from '@/components/measurements/FilterModal.vue';
import EditModal from '@/components/measurements/EditModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import GlobalStore from '@/stores/global.js';
import MeasurementsStore from '@/stores/measurements.js';
import { setBusy, showMessageDialog, deleteMeasurements, updateMeasurement, getMeasurements, getMaxAndMinFromDate } from '@/utils/utils.js';
import { formatDecimal, formatTimestamp, formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = MeasurementsStore;

// Load the measurements
const loadMeasurements = async () => {
    setBusy(true); // Busy on
    let params = { // Query parameters
        orderField: viewModel.orderBy || 'timestamp',
        orderDirection: viewModel.orderDirection || 'desc',
        limit: viewModel.limit, // Extraction limit
        offset: viewModel.offset // Offset for pagination
    };
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    try { // Try to get the measurements
        const results = await getMeasurements(params); // Get the measurements
        viewModel.measurementsList = results; // Update the data            
        handleTableSelectionChange(); // Check if selected
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while loading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// The filter dialog button "apply"
const handleApplyFilterPress = () => {
    viewModel.orderBy = viewModel.dialogFilter.orderBy; // Apply order by
    viewModel.orderDirection = viewModel.dialogFilter.orderDirection; // Apply order direction
    const startDate = getMaxAndMinFromDate(viewModel.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    loadMeasurements(); // Load measurements
};

// Select all table items
const handleSelectDeselectAllPress = () => {
    viewModel.selectedAll = !viewModel.selectedAll; // Change true/false
    viewModel.measurementsList.results.forEach(item => item.selected = viewModel.selectedAll);
    handleTableSelectionChange(); // Check if selected
};

// Table selection change event
const handleTableSelectionChange = () => {
    const selectedElements = viewModel.measurementsList.results.filter(item => item.selected); // Get the selected items
    viewModel.selectedElements = selectedElements; // If items selected, display mass delete button
};

// Open a dialog
const saveItemReference = measurement => {
    if (measurement) Object.assign(viewModel.tempMeasurement, { ...measurement }); // Save the element
};

// Edit the measurement
const handleSaveEditPress = async () => {
    setBusy(true); // Busy on
    const newData = { ...viewModel.tempMeasurement }; // Clone and clean object
    delete newData.timestamp; // Remove timestamp
    delete newData.selected; // Remove selected flag
    try { // Try to get the measurements
        const result = await updateMeasurement(newData); // Update the data
        loadMeasurements(); // Load the measurements
        showMessageDialog('Changes successfully saved!', 'success'); // Show toast
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while saving the changes', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Delete the measurement
const handleDeleteItemPress = async () => {
    try {
        setBusy(true); // Busy on
        const results = await deleteMeasurements([viewModel.tempMeasurement.id]);
        loadMeasurements(); // Load the measurements
        showMessageDialog('Measurement deleted successfully!', 'success'); // Show toast
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while deleting the measurement', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Reset button pressed
const handleRefreshPress = () => {
    loadMeasurements(); // Load the measurements
};

// Delete selected button pressed
const handleMassDeletePress = async () => {
    try {
        setBusy(true); // Busy on
        const selectedIds = viewModel.measurementsList.results.filter(item => item.selected).map(item => item.id); // Get the selected IDs
        const results = await deleteMeasurements(selectedIds); // Call mass delete
        loadMeasurements(); // Load the measurements
        showMessageDialog(`${results} measurements deleted successfully!`, 'success'); // Show toast
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while deleting the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Go to previous page
const previousPagePress = () => {
    viewModel.offset -= viewModel.limit; // Increase offset
    if (viewModel.offset < 0) viewModel.offset = 0; // Force 0 if negative
    loadMeasurements(); // Load measurements
};

// Go to next page
const nextPagePress = () => {
    if (viewModel.measurementsList?.results?.length >= viewModel.limit) viewModel.offset += viewModel.limit; // Increase
    loadMeasurements(); // Load measurements
};

// Init function
const init = () => {
    if (viewModel.initTableDone) return; // If already done, exit
    viewModel.initTableDone = true; // Mark as executed
    loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Table card -->
    <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <!-- Header -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                        <!-- Title -->
                        <div class="flex items-center">
                            <div class="mr-5">
                                <i class="fa-solid fa-table text-xl"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-semibold text-gray-800">Measurements</h2>
                                <p class="text-sm text-gray-600">The list of all the measurements taken by the station</p>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div>
                            <div class="inline-flex gap-x-2">
                                <button type="button" v-if="viewModel.selectedElements.length > 0" data-hs-overlay="#confirmMassDeleteModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none">
                                    <i class="fa-regular fa-trash-can"></i>Delete {{ viewModel.selectedElements.length }} items
                                </button>
                                <button id="testXXX" type="button" data-hs-overlay="#filterModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    <i class="fa-solid fa-filter"></i>Filter
                                </button>
                                <button type="button" @click="handleRefreshPress()" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    <i class="fa-solid fa-arrows-rotate"></i>Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th v-if="GlobalStore.adminToken" scope="col" class="px-6 py-3 text-center">
                                    <input type="checkbox" @change="handleSelectDeselectAllPress()" class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">ID</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">Timestamp</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">Temperature</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">Humidity</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">Pressure</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">Gas</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">PM1</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">PM2.5</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800">PM10</span>
                                </th>
                                <th v-if="GlobalStore.adminToken"></th>
                                <th v-if="GlobalStore.adminToken"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="item in viewModel.measurementsList.results">
                                <td v-if="GlobalStore.adminToken" class="size-px whitespace-nowrap">
                                    <div class="ps-6 py-3">
                                        <input type="checkbox" v-model="item.selected" @change="handleTableSelectionChange()" class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ item.id }}</span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500">{{ formatTimestamp(item.timestamp) }}</span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.temperature, 1) }} <span class="font-thin text-xs">°C</span></span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.humidity, 1) }} <span class="font-thin text-xs">%</span></span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.pressure, 0) }} <span class="font-thin text-xs">hPa</span></span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.gas, 0) }} <span class="font-thin text-xs">ppm</span></span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.pm1, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.pm25, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 font-bold">{{ formatDecimal(item.pm10, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                    </div>
                                </td>
                                <td v-if="GlobalStore.adminToken" class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <i class="fa-regular fa-pen-to-square custom-grey-2-text fs-5 cursor-pointer" data-hs-overlay="#editModal" @click="saveItemReference(item)"></i>
                                    </div>
                                </td>
                                <td v-if="GlobalStore.adminToken" class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <i class="fa-regular fa-trash-can custom-red-text fs-5 cursor-pointer" data-hs-overlay="#confirmDeleteModal" @click="saveItemReference(item)"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                        <div>
                            <p class="text-sm text-gray-600">
                                <span class="font-semibold text-gray-800">{{ viewModel.measurementsList.count }}</span> results
                            </p>
                        </div>
                        <div>
                            <div class="inline-flex gap-x-2">
                                <button type="button" @click="previousPagePress" :disabled="viewModel.offset === 0" class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                                    Prev
                                </button>
                                <button type="button" @click="nextPagePress" :disabled="viewModel.measurementsList?.results?.length < viewModel.limit" class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none">
                                    Next
                                    <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filter modal -->
    <FilterModal @apply="handleApplyFilterPress" />

    <!-- Edit modal -->
    <EditModal @save="handleSaveEditPress" />

    <!-- Confirm delete modal -->
    <ConfirmDialog id="confirmDeleteModal" message="Delete the measurement?" @confirm="handleDeleteItemPress" />

    <!-- Confirm mass delete modal -->
    <ConfirmDialog id="confirmMassDeleteModal" message="Delete the selected measurements?" @confirm="handleMassDeletePress" />
</template>