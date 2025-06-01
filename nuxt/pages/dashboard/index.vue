<script setup>
import { onMounted } from 'vue';
import { useSnapshotStore } from '~/composables/stores/useSnapshotStore.js';
import { setBusy, showMessageDialog, getMaxAndMinFromDate } from '~/composables/useUtils.js';
import { getMeasurements, getLastMeasurement, getAggregatedMeasurements } from '~/composables/api/useMeasurements.js';
import { formatJsDateToIsoStringDate } from '~/utils/formatter.js';
import CurrentDataCards from '~/components/charts/CurrentDataCards.vue';
import MeasurementsTable from '~/components/snapshot/MeasurementsTable.vue';
import LineChartCard from '~/components/charts/LineChartCard.vue';
import ScatterChartCard from '~/components/correlations/ScatterChartCard.vue';

// View model
const viewModel = useSnapshotStore();

// Get last week date
const getLastWeekDate = () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7); // Tot days ago
    const startDate = getMaxAndMinFromDate(pastDate).minDate; // Get the date at 00:00
    return formatJsDateToIsoStringDate(startDate, true); // Set formatted start date (If 1 day include time)
};

// Load the measurements
const loadMeasurements = async () => {
    const params = { limit: 50 }; // Query parameters

    try {
        const response = await getMeasurements(params); // Get the measurements
        viewModel.value.measurementsList = response; // Save the loaded measurements
        const measurementsListTable = { count: response.count || 0, results: response.results?.slice(0, 10) || [] }; // Cap to 10 measurements
        viewModel.value.measurementsListTable = measurementsListTable; // Set to model
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        throw newError; // Throw the error
    }
};

// Load the aggregated measurements
const loadAggregatedMeasurements = async () => {
    const startDate = getLastWeekDate(); // Get last week date
    const params = { startDate: startDate }; // Query parameters

    try {
        const results = await getAggregatedMeasurements(params); // Get the aggregated measurements
        viewModel.value.aggregatedMeasurementsList = results; // Save the loaded measurements
    } catch (error) {
        const newError = new Error('Error while reading the aggregated measurements', { cause: error }); // Save the old error to the stack
        throw newError; // Throw the error
    }
};

// Load the last measurement
const loadLastMeasurement = async () => {
    try {
        const result = await getLastMeasurement(); // Get the last measurement
        viewModel.value.lastMeasurement = result; // Save the measurement
    } catch (error) {
        const newError = new Error('Error while reading the last measurement', { cause: error }); // Save the old error to the stack
        throw newError; // Throw the error
    }
};

// Init function
const init = async () => {
    if (viewModel.value.initDone) return; // If already done, exit
    viewModel.value.initDone = true; // Mark as executed

    try {
        setBusy(true); // Busy on
        await Promise.all([ // Execute in parallel
            loadMeasurements(),
            loadAggregatedMeasurements(),
            loadLastMeasurement()
        ]);
    } catch (error) {
        showMessageDialog(error.message, 'error'); // Show error dialog
        console.error('Error loading measurements:', error);
    } finally {
        setBusy(false); // Busy off
    }
};

// On component mounted
onMounted(async () => {
    await init(); // Call init function
});
</script>

<template>
    <NuxtLayout name="dashboard">
        <!-- Header -->
        <div class="flex justify-between items-center mb-5">
            <div>
                <h2 class="font-bold text-2xl dark:text-neutral-200">Snapshot<i class="fa-solid fa-camera text-xl ms-3"></i></h2>
            </div>
        </div>

        <!-- Real-time data cards -->
        <div class="mb-6">
            <h5 class="font-bold mb-3 dark:text-neutral-200">Real-time data</h5>
            <CurrentDataCards :lastMeasurement="viewModel.lastMeasurement" />
        </div>

        <!-- Measurements table -->
        <div class="mb-6">
            <h5 class="font-bold mb-3 dark:text-neutral-200">Measurements list</h5>
            <MeasurementsTable :measurementsList="viewModel.measurementsListTable" />
        </div>

        <!-- Charts -->
        <div class="mb-6">
            <h5 class="font-bold mb-3 dark:text-neutral-200">Charts</h5>
            <div class="grid lg:grid-cols-2 gap-4 sm:gap-4">
                <!-- Temperature chart -->
                <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                    title="Temperature"
                    avgKey="temperatureAvg"
                    maxKey="temperatureMax"
                    minKey="temperatureMin" />

                <!-- Humidity chart -->
                <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                    title="Humidity"
                    avgKey="humidityAvg"
                    maxKey="humidityMax"
                    minKey="humidityMin" />

                <!-- Pressure chart -->
                <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                    title="Pressure"
                    avgKey="pressureAvg"
                    maxKey="pressureMax"
                    minKey="pressureMin" />

                <!-- Gas chart -->
                <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                    title="Gas"
                    avgKey="gasAvg"
                    maxKey="gasMax"
                    minKey="gasMin" />
            </div>
        </div>

        <!-- Correlations -->
        <div>
            <h5 class="font-bold mb-3 dark:text-neutral-200">Correlations</h5>
            <div class="grid lg:grid-cols-2 gap-4 sm:gap-4">
                <!-- Temperature/humidity chart -->
                <ScatterChartCard :measurementsList="viewModel.measurementsList?.results"
                    title="Temperature/Humidity"
                    xKey="temperature"
                    yKey="humidity" />

                <!-- PM2.5/PM10 chart -->
                <ScatterChartCard :measurementsList="viewModel.measurementsList?.results"
                    title="PM2.5/PM10"
                    xKey="pm25"
                    yKey="pm10" />

                <!-- Pressure/Gas chart -->
                <ScatterChartCard :measurementsList="viewModel.measurementsList?.results"
                    title="Pressure/Gas"
                    xKey="pressure"
                    yKey="gas" />

                <!-- Temperature/Gas chart -->
                <ScatterChartCard :measurementsList="viewModel.measurementsList?.results"
                    title="Temperature/Gas"
                    xKey="temperature"
                    yKey="gas" />
            </div>
        </div>
    </NuxtLayout>
</template>