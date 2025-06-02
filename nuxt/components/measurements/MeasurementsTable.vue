<script setup>
import { onMounted, ref } from 'vue';
import { useMeasurementsStore } from '~/composables/stores/useMeasurementsStore.js';
import { setBusy, showMessageDialog, getMaxAndMinFromDate, CustomError } from '~/composables/useUtils.js';
import { getMeasurements } from '~/composables/api/useMeasurements.js';
import { formatUnitNumber, formatTimestamp, formatJsDateToIsoStringDate } from '~/utils/formatter.js';
import FilterModal from '~/components/FilterModal.vue';
import CustomButton from '~/components/ui/CustomButton.vue';

const viewModel = useMeasurementsStore();
const filterModalOpen = ref(false);

// Load the measurements
const loadMeasurements = async () => {
    let params = { // Query parameters
        orderField: viewModel.value.orderBy || 'timestamp',
        orderDirection: viewModel.value.orderDirection || 'desc',
        measurementType: viewModel.value.measurementType || 'all',
        limit: viewModel.value.limit, // Extraction limit
        offset: viewModel.value.offset // Offset for pagination
    };

    if (viewModel.value.startDate) params.startDate = viewModel.value.startDate; // Add start date filter
    if (viewModel.value.endDate) params.endDate = viewModel.value.endDate; // Add end date filter

    try {
        setBusy(true); // Busy on
        const results = await getMeasurements(params); // Get the measurements
        viewModel.value.measurementsList = results; // Update the data
    } catch (error) {
        const customError = error.isCustom ? error.message : 'Error while loading the measurements';
        showMessageDialog(customError, 'error'); // Show toast
        throw error.isCustom ? error : new CustomError(customError); // Throw the error
    } finally {
        setBusy(false); // Busy off
    }
};

// Open filter modal button pressed
const handleOpenFilterModalPress = () => {
    filterModalOpen.value = true; // Open the modal
};

// The filter dialog button "apply"
const handleApplyFilterPress = async filters => {
    viewModel.value.dialogFilter = filters; // Save the new filters
    viewModel.value.orderBy = viewModel.value.dialogFilter.orderBy; // Apply order by
    viewModel.value.orderDirection = viewModel.value.dialogFilter.orderDirection; // Apply order direction
    viewModel.value.measurementType = viewModel.value.dialogFilter.measurementType; // Apply measurement type
    const startDate = getMaxAndMinFromDate(viewModel.value.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.value.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.value.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.value.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    await loadMeasurements(); // Load measurements
};

// Reset button pressed
const handleRefreshPress = async () => {
    await loadMeasurements(); // Load the measurements
};

// Go to previous page
const previousPagePress = async () => {
    viewModel.value.offset -= viewModel.value.limit; // Increase offset
    if (viewModel.value.offset < 0) viewModel.value.offset = 0; // Force 0 if negative
    await loadMeasurements(); // Load the measurements
};

// Go to next page
const nextPagePress = async () => {
    if (viewModel.value.measurementsList?.results?.length >= viewModel.value.limit) viewModel.value.offset += viewModel.value.limit; // Increase
    await loadMeasurements(); // Load the measurements
};

// Init function
const init = async () => {
    if (viewModel.value.initTableDone) return; // If already done, exit
    viewModel.value.initTableDone = true; // Mark as executed

    // Load the measurements
    await loadMeasurements();
};

// On component mounted
onMounted(async () => {
    await init();
});
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
                                <CustomButton type="primary" text="Filter" icon="fa-solid fa-filter" @click="handleOpenFilterModalPress" />
                                <CustomButton type="primary" text="Refresh" icon="fa-solid fa-arrows-rotate" @click="handleRefreshPress" />
                            </div>
                        </div>
                    </div>

                    <!-- Table -->
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50 dark:bg-neutral-800">
                            <tr>
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
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            <tr v-for="item in viewModel.measurementsList.results">
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
                                <CustomButton type="secondary" text="Prev" icon="fa-solid fa-chevron-left" :disabled="viewModel.offset === 0" @click="previousPagePress" />
                                <CustomButton type="secondary" text="Next" icon-end="fa-solid fa-chevron-right" :disabled="viewModel.measurementsList?.results?.length < viewModel.limit" @click="nextPagePress" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filter modal -->
    <FilterModal :visible="filterModalOpen" @update:visible="filterModalOpen = $event" :filters="viewModel.filters" @apply="handleApplyFilterPress" :startDateVisible="true" :endDateVisible="true" :orderByVisible="true" :orderDirectionVisible="true" :measurementTypeVisible="true" />
</template>