<script setup>
import { nextTick, watch } from 'vue';
import FilterModal from '@/components/measurements/FilterModal.vue';
import EditModal from '@/components/measurements/EditModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import GlobalStore from '@/stores/global.js';
import MeasurementsStore from '@/stores/measurements.js';
import { setBusy, showMessageDialog, getMaxAndMinFromDate, CustomError } from '@/utils/utils.js';
import { deleteMeasurements, updateMeasurement, getMeasurements } from '@/utils/webRequests.js';
import { formatUnitNumber, formatTimestamp, formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = MeasurementsStore;

// Add watcher for selectedElements (Workaround for multi delete button visibility)
watch(() => viewModel.selectedElements, async () => {
    await nextTick(); // Wait for the DOM to update
    if (window.HSOverlay) {
        window.HSOverlay.autoInit(); // Reinit the overlay
    }
});

// Load the measurements
const loadMeasurements = async () => {
    setBusy(true); // Busy on
    let params = { // Query parameters
        orderField: viewModel.orderBy || 'timestamp',
        orderDirection: viewModel.orderDirection || 'desc',
        measurementType: viewModel.measurementType || 'all',
        limit: viewModel.limit, // Extraction limit
        offset: viewModel.offset // Offset for pagination
    };
    
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter

    try {
        const results = await getMeasurements(params); // Get the measurements
        viewModel.measurementsList = results; // Update the data
        handleTableSelectionChange(); // Check if selected
        setBusy(false); // Busy off
    } catch (error) {
        setBusy(false); // Busy off
        const customError = error.isCustom ? error.message : 'Error while loading the measurements';
        showMessageDialog(customError, 'error'); // Show toast
        throw error.isCustom ? error : new CustomError(customError); // Throw the error
    }
};

// The filter dialog button "apply"
const handleApplyFilterPress = async () => {
    viewModel.orderBy = viewModel.dialogFilter.orderBy; // Apply order by
    viewModel.orderDirection = viewModel.dialogFilter.orderDirection; // Apply order direction
    viewModel.measurementType = viewModel.dialogFilter.measurementType; // Apply measurement type
    const startDate = getMaxAndMinFromDate(viewModel.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    await loadMeasurements(); // Load measurements
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
        await updateMeasurement(newData); // Update the data
        showMessageDialog('Changes successfully saved!', 'success'); // Show toast
        await loadMeasurements(); // Load the measurements
    } catch(error) {
        setBusy(false); // Busy off
        const customError = error.isCustom ? error.message : 'Error while saving the changes';
        showMessageDialog(customError, 'error'); // Show toast
        throw error.isCustom ? error : new CustomError(customError); // Throw the error
    }
};

// Delete the measurement
const handleDeleteItemPress = async () => {
    try {
        setBusy(true); // Busy on
        const results = await deleteMeasurements([viewModel.tempMeasurement.id]);
        showMessageDialog('Measurement deleted successfully!', 'success'); // Show toast
        await loadMeasurements(); // Load the measurements
    } catch(error) {
        setBusy(false); // Busy off
        const customError = error.isCustom ? error.message : 'Error while deleting the measurement';
        showMessageDialog(customError, 'error'); // Show toast
        throw error.isCustom ? error : new CustomError(customError); // Throw the error
    }
};

// Reset button pressed
const handleRefreshPress = async () => {
    await loadMeasurements(); // Load the measurements
};

// Delete selected button pressed
const handleMassDeletePress = async () => {
    try {
        setBusy(true); // Busy on
        const selectedIds = viewModel.measurementsList.results.filter(item => item.selected).map(item => item.id); // Get the selected IDs
        const results = await deleteMeasurements(selectedIds); // Call mass delete
        showMessageDialog(`${results} measurements deleted successfully!`, 'success'); // Show toast
        await loadMeasurements(); // Load the measurements
    } catch(error) {
        setBusy(false); // Busy off
        const customError = error.isCustom ? error.message : 'Error while deleting the measurements';
        showMessageDialog(customError, 'error'); // Show toast
        throw error.isCustom ? error : new CustomError(customError); // Throw the error
    }
};

// Go to previous page
const previousPagePress = async () => {
    viewModel.offset -= viewModel.limit; // Increase offset
    if (viewModel.offset < 0) viewModel.offset = 0; // Force 0 if negative
    await loadMeasurements(); // Load the measurements
};

// Go to next page
const nextPagePress = async () => {
    if (viewModel.measurementsList?.results?.length >= viewModel.limit) viewModel.offset += viewModel.limit; // Increase
    await loadMeasurements(); // Load the measurements
};

// Init function
const init = async () => {
    if (viewModel.initTableDone) return; // If already done, exit
    viewModel.initTableDone = true; // Mark as executed
    await loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Table card -->
    <div class="flex flex-col">
        <div class="-m-1.5 overflow-x-auto">
            <div class="p-1.5 min-w-full inline-block align-middle">
                <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-800 dark:border-neutral-500">
                    <!-- Header -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200">
                        <!-- Title -->
                        <div class="flex items-center">
                            <div class="mr-5">
                                <i class="fa-solid fa-table text-xl dark:text-neutral-200"></i>
                            </div>
                            <div>
                                <h2 class="text-xl font-bold text-gray-800 dark:text-neutral-200">Measurements</h2>
                                <p class="text-sm text-gray-600 dark:text-neutral-200">The list of all the measurements taken by the station</p>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div>
                            <div class="inline-flex gap-x-2">
                                <button type="button" v-if="viewModel.selectedElements.length > 0" data-hs-overlay="#confirmMassDeleteModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-700 disabled:opacity-50 disabled:pointer-events-none">
                                    <i class="fa-regular fa-trash-can"></i>Delete {{ viewModel.selectedElements.length }} items
                                </button>
                                <button type="button" data-hs-overlay="#filterModal" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    <i class="fa-solid fa-filter"></i>Filter
                                </button>
                                <button type="button" @click="handleRefreshPress()" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                    <i class="fa-solid fa-arrows-rotate"></i>Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50 dark:bg-neutral-800">
                            <tr>
                                <th v-if="GlobalStore.loggedIn" scope="col" class="px-6 py-3 text-center">
                                    <input type="checkbox" @change="handleSelectDeselectAllPress()" class="shrink-0 w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">ID</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Timestamp</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Temperature</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Humidity</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Pressure</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">Gas</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">PM1</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">PM2.5</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-center">
                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">PM10</span>
                                </th>
                                <th v-if="GlobalStore.loggedIn"></th>
                                <th v-if="GlobalStore.loggedIn"></th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="item in viewModel.measurementsList.results">
                                <td v-if="GlobalStore.loggedIn" class="size-px whitespace-nowrap">
                                    <div class="ps-6 py-3">
                                        <input type="checkbox" v-model="item.selected" @change="handleTableSelectionChange()" class="shrink-0 w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ item.id }}</span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <span class="text-sm text-gray-500 dark:text-neutral-200">{{ formatTimestamp(item.timestamp) }}</span>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.temperatureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.temperature, 1) }} <span class="font-thin text-xs">°C</span></span>
                                        </div>
                                        <div v-if="item.temperatureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.temperature, 1) }} <span class="font-thin text-xs">°C</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.humidityAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.humidity, 1) }} <span class="font-thin text-xs">%</span></span>
                                        </div>
                                        <div v-if="item.humidityAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.humidity, 1) }} <span class="font-thin text-xs">%</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pressureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pressure, 1) }} <span class="font-thin text-xs">hPa</span></span>
                                        </div>
                                        <div v-if="item.pressureAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pressure, 1) }} <span class="font-thin text-xs">hPa</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.gasAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.gas, 1) }} <span class="font-thin text-xs">kOhm</span></span>
                                        </div>
                                        <div v-if="item.gasAnomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.gas, 1) }} <span class="font-thin text-xs">kOhm</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pm1Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm1, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                        </div>
                                        <div v-if="item.pm1Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm1, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pm25Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm25, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                        </div>
                                        <div v-if="item.pm25Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm25, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td class="size-px whitespace-nowrap">
                                    <div class="px-6 py-3 text-center">
                                        <div v-if="!item.pm10Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm10, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                        </div>
                                        <div v-if="item.pm10Anomaly">
                                            <span class="text-sm text-gray-500 dark:text-neutral-200 font-bold">{{ formatUnitNumber(item.pm10, 0) }} <span class="font-thin text-xs">µg/m³</span></span>
                                            <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 ms-2" title="Anomalous value, 2 standard deviations from the norm"></i>
                                        </div>
                                    </div>
                                </td>
                                <td v-if="GlobalStore.loggedIn" class="size-px whitespace-nowrap">
                                    <div class="px-4 py-3 text-center">
                                        <i class="fa-regular fa-pen-to-square text-lg cursor-pointer text-gray-500" data-hs-overlay="#editModal" @click="saveItemReference(item)"></i>
                                    </div>
                                </td>
                                <td v-if="GlobalStore.loggedIn" class="size-px whitespace-nowrap">
                                    <div class="px-4 py-3 text-center">
                                        <i class="fa-regular fa-trash-can text-lg cursor-pointer text-red-500" data-hs-overlay="#confirmDeleteModal" @click="saveItemReference(item)"></i>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- Footer -->
                    <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200">
                        <div>
                            <p class="text-sm text-gray-600 dark:text-neutral-200">
                                <span class="font-bold text-gray-800 dark:text-neutral-200">{{ viewModel.measurementsList.count }}</span> results
                            </p>
                        </div>
                        <div>
                            <div class="inline-flex gap-x-2">
                                <button type="button" @click="previousPagePress" :disabled="viewModel.offset === 0" class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:text-white dark:hover:bg-neutral-800">
                                    <i class="fa-solid fa-chevron-left ms-1"></i>Prev
                                </button>
                                <button type="button" @click="nextPagePress" :disabled="viewModel.measurementsList?.results?.length < viewModel.limit" class="py-1.5 px-2 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:text-white dark:hover:bg-neutral-800">
                                    Next<i class="fa-solid fa-chevron-right me-1"></i>
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