<script setup>
import { onMounted } from 'vue';
import { useCorrelationsStore } from '~/composables/stores/useCorrelationsStore.js';
import TempHumScatterChart from '~/components/correlations/TempHumScatterChart.vue';
import Pm25Pm10ScatterChart from '~/components/correlations/Pm25Pm10ScatterChart.vue';
import PressGasScatterChart from '~/components/correlations/PressGasScatterChart.vue';
import TempGasScatterChart from '~/components/correlations/TempGasScatterChart.vue';
import TempPm1ScatterChart from '~/components/correlations/TempPm1ScatterChart.vue';
import HumPm1ScatterChart from '~/components/correlations/HumPm1ScatterChart.vue';
import FilterModal from '~/components/FilterModal.vue';
import { setBusy, showMessageDialog, getMaxAndMinFromDate } from '~/composables/useUtils.js';
import { getMeasurements } from '~/composables/api/useMeasurements.js';
import { formatJsDateToIsoStringDate } from '~/utils/formatter.js';

// View model
const viewModel = useCorrelationsStore();
const filterModalOpen = ref(false);

// Load the measurements
const loadMeasurements = async () => {
    const params = {};
    if (viewModel.value.startDate) params.startDate = viewModel.value.startDate; // Add start date filter
    if (viewModel.value.endDate) params.endDate = viewModel.value.endDate; // Add end date filter

    try {
        setBusy(true); // Busy on
        const results = await getMeasurements(params); // Get the aggregated measurements
        viewModel.value.measurementsList = results; // Save the loaded measurements
        setBusy(false); // Busy off
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    } finally {
        setBusy(false); // Busy off
    }
};

// Add the filter dates from the selected period
const addFilterDatesFromPeriod = () => {
    let days = 1; // Number of days to filter
    switch (viewModel.value.periodSelect) {
        case 'D':
            days = 1;
            break;
        case 'W':
            days = 7;
            break;
        case 'M':
            days = 30;
            break;
        case 'Y':
            days = 365;
            break;
    }

    // Create the start and end dates
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days); // Tot days ago
    const startDate = days === 1 ? pastDate : getMaxAndMinFromDate(pastDate).minDate; // Get the date at 00:00
    viewModel.value.startDate = formatJsDateToIsoStringDate(startDate, true); // Set formatted start date (If 1 day include time)
};

// When period select changed
const handlePeriodChange = event => {
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

// Open filter modal button pressed
const handleOpenFilterModalPress = () => {
    filterModalOpen.value = true; // Open the modal
};

// Handle filter dialog button "apply"
const handleApplyFilterPress = filters => {
    viewModel.value.dialogFilter = filters; // Save the filters
    const startDate = getMaxAndMinFromDate(viewModel.value.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.value.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.value.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.value.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    loadMeasurements(); // Load measurements
};

// Init function
const init = async () => {
    if (viewModel.value.initDone) return; // If already done, exit
    viewModel.value.initDone = true; // Mark as executed

    // Load the measurements
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    await loadMeasurements(); // Load the measurements
};

// On component mounted
onMounted(async () => {
    await init();
});
</script>

<template>
    <NuxtLayout name="dashboard">
        <!-- Header -->
        <div class="md:flex justify-between items-center mb-5">
            <!-- Left -->
            <div class="mb-3 md:mb-0">
                <h2 class="font-bold text-2xl dark:text-neutral-200">Correlations<i class="fa-solid fa-magnifying-glass-chart text-xl ms-3"></i></h2>
            </div>

            <!-- Right -->
            <div class="flex items-center">
                <!-- Filter button -->
                <CustomButton type="primary" text="Filter" icon="fa-solid fa-filter" @click="handleOpenFilterModalPress" />

                <!-- Periods select -->
                <CustomSelect v-model="viewModel.periodSelect" @change="handlePeriodChange" class="ms-2">
                    <option value="D">Last day</option>
                    <option value="W">Last week</option>
                    <option value="M">Last month</option>
                    <option value="Y">Last year</option>
                </CustomSelect>
            </div>
        </div>

        <!-- Charts -->
        <div>
            <h5 class="font-bold mb-3 dark:text-neutral-200">Charts</h5>
            <div class="grid lg:grid-cols-2 gap-4 sm:gap-4">
                <!-- Temperature/PM1 chart -->
                <TempPm1ScatterChart :measurementsList="viewModel.measurementsList?.results" />

                <!-- Temperature/humidity chart -->
                <TempHumScatterChart :measurementsList="viewModel.measurementsList?.results" />

                <!-- PM2.5/PM10 chart -->
                <Pm25Pm10ScatterChart :measurementsList="viewModel.measurementsList?.results" />

                <!-- Pressure/Gas chart -->
                <PressGasScatterChart :measurementsList="viewModel.measurementsList?.results" />

                <!-- Temperature/Gas chart -->
                <TempGasScatterChart :measurementsList="viewModel.measurementsList?.results" />

                <!-- Temperature/PM1 chart -->
                <TempPm1ScatterChart :measurementsList="viewModel.measurementsList?.results" />

                <!-- Humidity/PM1 chart -->
                <HumPm1ScatterChart :measurementsList="viewModel.measurementsList?.results" />
            </div>
        </div>

        <!-- Filter modal -->
        <FilterModal :visible="filterModalOpen"
            :filters="viewModel.filters"
            @apply="handleApplyFilterPress"
            @update:visible="filterModalOpen = $event"
            :startDateVisible="true"
            :endDateVisible="true" />
    </NuxtLayout>
</template>