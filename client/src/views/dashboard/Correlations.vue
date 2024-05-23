<script setup>
import TempHumScatterChart from '@/components/correlations/TempHumScatterChart.vue';
import Pm25Pm10ScatterChart from '@/components/correlations/Pm25Pm10ScatterChart.vue';
import PressGasScatterChart from '@/components/correlations/PressGasScatterChart.vue';
import TempGasScatterChart from '@/components/correlations/TempGasScatterChart.vue';
import TempPm1ScatterChart from '@/components/correlations/TempPm1ScatterChart.vue';
import HumPm1ScatterChart from '@/components/correlations/HumPm1ScatterChart.vue';
import CorrelationsStore from '@/stores/correlations.js';
import { getMeasurements, setBusy, showMessageDialog, getMaxAndMinFromDate } from '@/utils/utils.js';
import { formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = CorrelationsStore;

// Load the measurements
const loadMeasurements = async () => {
    setBusy(true); // Busy on
    const params = {};
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    try { // Try to get the data
        const results = await getMeasurements(params); // Get the aggregated measurements
        viewModel.measurementsList = results; // Save the loaded measurements
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Add the filter dates from the selected period
const addFilterDatesFromPeriod = () => {
    let days = 1; // Number of days to filter
    switch (viewModel.periodSelect) {
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
    viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Set formatted start date (If 1 day include time)
};

// When period select changed
const handlePeriodChange = event => {
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

// Handle filter dialog button "apply"
const handleApplyFilterPress = () => {
    const startDate = getMaxAndMinFromDate(viewModel.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    loadMeasurements(); // Load measurements
};

// Init function
const init = () => {
    if (viewModel.initDone) return; // If already done, exit
    viewModel.initDone = true; // Mark as executed
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Header -->
    <div class="flex justify-between items-center mb-5">
        <!-- Left -->
        <div>
            <h2 class="font-bold text-2xl">Correlations<i class="fa-solid fa-chart-line text-xl leading-none ms-3"></i></h2>
        </div>

        <!-- Right -->
        <div>
            <!-- Button filter modal -->
            <button type="button" data-hs-overlay="#filterModal" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 me-2">
                <i class="fa-solid fa-filter fs-5"></i>Filter
            </button>

            <!-- Periods select -->
            <select class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800" v-model="viewModel.periodSelect" @change="handlePeriodChange">
                <option value="D">Last day</option>
                <option value="W">Last week</option>
                <option value="M">Last month</option>
                <option value="Y">Last year</option>
            </select>
        </div>
    </div>

	<!-- Real-time data cards -->
	<div class="mb-6">
		<CurrentDataCards :lastMeasurement="viewModel.lastMeasurement" />
	</div>

	<!-- Charts -->
	<div>
		<h5 class="mb-3">Charts</h5>
		<div class="grid lg:grid-cols-2 gap-4 sm:gap-4">
			<!-- Temperature chart -->
			<TemperatureLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />

            <!-- Humidity chart -->
			<HumidityLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />

            <!-- Pressure chart -->
			<PressureLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />

            <!-- Gas chart -->
			<GasLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />

            <!-- PM1 chart -->
			<Pm1LineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />

            <!-- PM2.5 chart -->
			<Pm25LineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />

            <!-- PM10 chart -->
			<Pm10LineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />
		</div>
	</div>

    <!-- Filter modal -->
    <FilterModal @apply="handleApplyFilterPress" />
</template>