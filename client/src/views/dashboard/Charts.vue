<script setup>
import TemperatureLineChart from '@/components/charts/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/charts/HumidityLineChart.vue';
import PressureLineChart from '@/components/charts/PressureLineChart.vue';
import GasLineChart from '@/components/charts/GasLineChart.vue';
import Pm1LineChart from '@/components/charts/Pm1LineChart.vue';
import Pm25LineChart from '@/components/charts/Pm25LineChart.vue';
import Pm10LineChart from '@/components/charts/Pm10LineChart.vue';
import CurrentDataCards from '@/components/charts/CurrentDataCards.vue';
import FilterModal from '@/components/charts/FilterModal.vue';
import ChartsStore from '@/stores/charts.js';
import { getAggregatedMeasurements, setBusy, showMessageDialog, getMaxAndMinFromDate, getLastMeasurement } from '@/utils/utils.js';
import { formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = ChartsStore;

// Load the measurements
const loadMeasurements = async () => {
    setBusy(true); // Busy on
    const params = {};
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    try { // Try to get the data
        const results = await getAggregatedMeasurements(params); // Get the aggregated measurements
        viewModel.aggregatedMeasurementsList = results; // Save the loaded measurements
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Load the last measurement
const loadLastMeasurement = async () => {
    const result = await getLastMeasurement(); // Get the last measurement
    viewModel.lastMeasurement = result; // Save the measurement
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

/* Add the events to the select components
const addSelectEvents = async() => {
    const { HSSelect } = await import("preline/preline");
    const periodSelect = HSSelect.getInstance("#periodSelect");
    periodSelect.on("change", value => {
        viewModel.periodSelect = value; // Set value
        handlePeriodChange(); // Fire event
    });
};
*/

// Init function
const init = () => {
    if (viewModel.initDone) return; // If already done, exit
    viewModel.initDone = true; // Mark as executed
    // addSelectEvents(); // Add the events to the select components
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadLastMeasurement(); // Load the last measurement
    loadMeasurements(); // Load the measurements
};

init(); // Call init function

</script>

<template>
    <!-- Header -->
    <div class="md:flex justify-between items-center mb-5">
        <!-- Left -->
        <div class="mb-3 md:mb-0">
            <h2 class="font-bold text-2xl dark:text-neutral-200">Charts<i class="fa-solid fa-chart-line text-xl ms-3"></i></h2>
        </div>

        <!-- Right -->
        <div class="flex items-center">
            <!-- Button filter modal -->
            <button type="button" data-hs-overlay="#filterModal" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:text-neutral-200 dark:hover:bg-neutral-700 me-2">
                <i class="fa-solid fa-filter fs-5"></i>Filter
            </button>

            <!-- Periods select
            <select id="periodSelect" class="hidden" data-hs-select='{
                "placeholder": "Select option...",
                "toggleTag": "<button type=\"button\" class=\"w-[135px]\"></button>",
                "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400",
                "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700",
                "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800",
                "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-3.5 text-blue-600 dark:text-blue-500\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"flex-shrink-0 size-3.5 text-gray-500 dark:text-neutral-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                }'>
                <option value="D">Last day</option>
                <option value="W">Last week</option>
                <option value="M">Last month</option>
                <option value="Y">Last year</option>
            </select> -->

            <!-- Periods select -->
            <select v-model="viewModel.periodSelect" @change="handlePeriodChange" class="py-3 px-4 pe-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-500 dark:text-neutral-200">
                <option value="D">Last day</option>
                <option value="W">Last week</option>
                <option value="M">Last month</option>
                <option value="Y">Last year</option>
            </select>
        </div>
    </div>

	<!-- Real-time data cards -->
	<div class="mb-6">
        <h5 class="font-bold mb-3 dark:text-neutral-200">Real-time data</h5>
		<CurrentDataCards :lastMeasurement="viewModel.lastMeasurement" />
	</div>

	<!-- Charts -->
	<div>
		<h5 class="font-bold mb-3 dark:text-neutral-200">Charts</h5>
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