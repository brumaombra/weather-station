<script setup>
import { onMounted, ref } from 'vue';
import { useMeasurementsStore } from '~/composables/stores/useMeasurementsStore.js';
import { setBusy, showMessageDialog, getMaxAndMinFromDate, CustomError } from '~/composables/useUtils.js';
import { getMeasurements } from '~/composables/api/useMeasurements.js';
import { formatUnitNumber, formatTimestamp, formatJsDateToIsoStringDate } from '~/utils/formatter.js';
import FilterModal from '~/components/FilterModal.vue';
import Button from '~/components/ui/Button.vue';
import AnomalyAlert from '~/components/measurements/AnomalyAlert.vue';

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
    <div class="flex flex-col custom-box-shadow-2 rounded-2xl border border-gray-200/50 backdrop-blur-sm overflow-hidden">
        <div class="overflow-x-auto">
            <div class="min-w-full inline-block align-middle">
                <!-- Header -->
                <div class="px-8 py-6 border-b border-gray-100/80 dark:border-neutral-700/50 bg-white">
                    <!-- Title Section -->
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div class="flex items-center gap-5">
                            <!-- Icon -->
                            <div class="relative">
                                <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25"></div>
                                <div class="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                                    <i class="fa-solid fa-table text-xl text-white drop-shadow-sm"></i>
                                </div>
                            </div>

                            <!-- Title -->
                            <div class="flex-1">
                                <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent tracking-tight">
                                    Measurements
                                </h2>
                                <div class="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 mb-1"></div>
                                <p class="text-sm text-gray-600 dark:text-neutral-400 font-medium">The complete list of environmental measurements taken by the station</p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex-shrink-0">
                            <div class="flex items-center gap-3">
                                <Button type="secondary" text="Filter" icon="fa-solid fa-filter" @click="handleOpenFilterModalPress" />
                                <Button type="primary" text="Refresh" icon="fa-solid fa-arrows-rotate" @click="handleRefreshPress" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="!viewModel.measurementsList?.results?.length" class="px-8 py-16 text-center">
                    <div class="max-w-md mx-auto">
                        <div class="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-800 rounded-2xl mx-auto mb-6">
                            <i class="fa-solid fa-database text-2xl text-gray-400 dark:text-neutral-500"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 dark:text-neutral-100 mb-2">No measurements found</h3>
                        <p class="text-sm text-gray-500 dark:text-neutral-400 mb-6">There are no measurements to display at the moment. Try adjusting your filters or check back later.</p>
                        <Button type="primary" text="Refresh" icon="fa-solid fa-arrows-rotate" @click="handleRefreshPress" />
                    </div>
                </div>

                <!-- Table Container -->
                <div v-else class="">
                    <table class="min-w-full">
                        <thead>
                            <tr class="bg-gray-50 border-b border-gray-100 dark:border-neutral-700">
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">ID</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">Timestamp</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">Temperature</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">Humidity</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">Pressure</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">Gas</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">PM1</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">PM2.5</span>
                                </th>
                                <th scope="col" class="px-6 py-5 text-center">
                                    <span class="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-neutral-300">PM10</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 dark:divide-neutral-700/50">
                            <tr v-for="item in viewModel.measurementsList.results" :key="item.id" class="group bg-white hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 dark:hover:from-neutral-800/50 dark:hover:to-neutral-700/30 transition-all duration-200">
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center">
                                        <span class="inline-flex items-center justify-center w-8 h-8 text-xs font-bold text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform duration-200">
                                            {{ item.id }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="text-sm font-medium text-gray-700 dark:text-neutral-200">
                                        {{ formatTimestamp(item.timestamp) }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.temperature, 1) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">°C</span>
                                        </div>
                                        <AnomalyAlert :show="item.temperatureAnomaly" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.humidity, 1) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">%</span>
                                        </div>
                                        <AnomalyAlert :show="item.humidityAnomaly" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.pressure, 1) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">hPa</span>
                                        </div>
                                        <AnomalyAlert :show="item.pressureAnomaly" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.gas, 1) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">kOhm</span>
                                        </div>
                                        <AnomalyAlert :show="item.gasAnomaly" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.pm1, 0) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">µg/m³</span>
                                        </div>
                                        <AnomalyAlert :show="item.pm1Anomaly" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.pm25, 0) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">µg/m³</span>
                                        </div>
                                        <AnomalyAlert :show="item.pm25Anomaly" />
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center">
                                    <div class="flex items-center justify-center gap-2">
                                        <div class="flex items-center gap-1">
                                            <span class="text-sm font-bold text-gray-900 dark:text-neutral-100">
                                                {{ formatUnitNumber(item.pm10, 0) }}
                                            </span>
                                            <span class="text-xs text-gray-500 dark:text-neutral-400 font-medium">µg/m³</span>
                                        </div>
                                        <AnomalyAlert :show="item.pm10Anomaly" />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Footer -->
                <div class="px-8 py-6 bg-white border-t border-gray-100/80 dark:border-neutral-700/50">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div class="flex items-center gap-2">
                            <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                                <i class="fa-solid fa-chart-bar text-blue-600 dark:text-blue-400 text-sm"></i>
                            </div>
                            <p class="text-sm font-medium text-gray-700 dark:text-neutral-300">
                                <span class="font-bold text-gray-900 dark:text-neutral-100">{{ viewModel.measurementsList.count }}</span> total measurements
                            </p>
                        </div>
                        <div class="flex items-center gap-3">
                            <Button type="secondary" text="Previous" icon="fa-solid fa-chevron-left" :disabled="viewModel.offset === 0" @click="previousPagePress" />
                            <Button type="secondary" text="Next" icon-end="fa-solid fa-chevron-right" :disabled="viewModel.measurementsList?.results?.length < viewModel.limit" @click="nextPagePress" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Filter modal -->
    <FilterModal :visible="filterModalOpen" @update:visible="filterModalOpen = $event" :filters="viewModel.filters" @apply="handleApplyFilterPress" :startDateVisible="true" :endDateVisible="true" :orderByVisible="true" :orderDirectionVisible="true" :measurementTypeVisible="true" />
</template>