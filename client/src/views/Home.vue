<script setup>
import TemperatureLineChart from '@/components/charts/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/charts/HumidityLineChart.vue';
import PressureLineChart from '@/components/charts/PressureLineChart.vue';
import GasLineChart from '@/components/charts/GasLineChart.vue';
import TempHumScatterChart from '@/components/correlations/TempHumScatterChart.vue';
import Pm25Pm10ScatterChart from '@/components/correlations/Pm25Pm10ScatterChart.vue';
import PressGasScatterChart from '@/components/correlations/PressGasScatterChart.vue';
import TempGasScatterChart from '@/components/correlations/TempGasScatterChart.vue';
import CurrentDataCards from '@/components/charts/CurrentDataCards.vue';
import HomeStore from '@/stores/home.js';
import { getMeasurements, getAggregatedMeasurements, setBusy, showMessageDialog, getLastMeasurement, getMaxAndMinFromDate } from '@/utils/utils.js';
import { formatTimestamp, formatDecimal, formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = HomeStore;

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
    try { // Try to get the data
        const results = await getMeasurements(params); // Get the aggregated measurements
        viewModel.measurementsList = results; // Save the loaded measurements
    } catch(error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Load the aggregated measurements
const loadAggregatedMeasurements = async () => {
    const startDate = getLastWeekDate(); // Get last week date
    const params = { startDate: startDate }; // Query parameters
    try { // Try to get the data
        const results = await getAggregatedMeasurements(params); // Get the aggregated measurements
        viewModel.aggregatedMeasurementsList = results; // Save the loaded measurements
    } catch(error) {
        const newError = new Error('Error while reading the aggregated measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Load the last measurement
const loadLastMeasurement = async () => {
    const result = await getLastMeasurement(); // Get the last measurement
    viewModel.lastMeasurement = result; // Save the measurement
};

// Init function
const init = async () => {
    if (viewModel.initDone) return; // If already done, exit
    viewModel.initDone = true; // Mark as executed
    setBusy(true); // Busy on
    await loadLastMeasurement(); // Load the last measurement
    await loadMeasurements(); // Load the measurements
    await loadAggregatedMeasurements(); // Load the aggregated measurements
    setBusy(false); // Busy off
};

init(); // Call init function

</script>

<template>
    <!-- Toolbar -->
    <div class="row">
        <div class="col-md-6 col-12">
            <!-- Title -->
            <div class="d-flex align-items-center justify-content-between h-100">
                <h3 class="mb-0"><i class="fa-solid fa-house me-3"></i>Home</h3>
            </div>
        </div>
    </div>

    <!-- Real-time data cards -->
    <div class="mb-5">
        <CurrentDataCards :lastMeasurement="viewModel.lastMeasurement" />
    </div>

    <!-- Measurements -->
    <div class="row mb-4">
        <div class="col-md-6 col-12">
            <!-- Title -->
            <div class="d-flex align-items-center justify-content-between h-100">
                <h3 class="mb-0"><i class="fa-solid fa-table me-3"></i>Measurements<span class="badge custom-grey-2-background rounded-3 ms-3">{{ viewModel.measurementsList.count }}</span></h3>
            </div>
        </div>
    </div>

    <!-- Measurements table -->
    <div class="table-responsive mb-5">
        <table class="table table-striped">
            <thead class="text-center">
                <tr>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Pressure</th>
                    <th>Gas</th>
                    <th>PM1</th>
                    <th>PM2.5</th>
                    <th>PM10</th>
                </tr>
            </thead>
            <tbody class="text-center">
                <tr v-for="item in viewModel.measurementsList.results.slice(0, 10)">
                    <th class="column-id">{{ item.id }}</th>
                    <td class="column-timestamp">{{ formatTimestamp(item.timestamp) }}</td>
                    <td class="column-measurements">{{ formatDecimal(item.temperature, 1) }} <span class="measurementUnit">°C</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.humidity, 1) }} <span class="measurementUnit">%</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pressure, 0) }} <span class="measurementUnit">hPa</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.gas, 0) }} <span class="measurementUnit">ppm</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pm1, 0) }} <span class="measurementUnit">µg/m³</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pm25, 0) }} <span class="measurementUnit">µg/m³</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pm10, 0) }} <span class="measurementUnit">µg/m³</span></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Charts -->
    <div class="row">
        <div class="col-md-6 col-12">
            <!-- Title -->
            <div class="d-flex align-items-center justify-content-between h-100">
                <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Charts</h3>
            </div>
        </div>
    </div>

    <!-- Responsive grid -->
    <div class="mb-5">
        <div class="row">
            <!-- Temperature chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TemperatureLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />
            </div>

            <!-- Humidity chart -->
            <div class="col-lg-6 col-12 mt-5">
                <HumidityLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />
            </div>

            <!-- Pressure chart -->
            <div class="col-lg-6 col-12 mt-5">
                <PressureLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />
            </div>

            <!-- Gas chart -->
            <div class="col-lg-6 col-12 mt-5">
                <GasLineChart :measurementsList="viewModel.aggregatedMeasurementsList?.results" />
            </div>
        </div>
    </div>

    <!-- Correlations -->
    <div class="row">
        <div class="col-md-6 col-12">
            <!-- Title -->
            <div class="d-flex align-items-center justify-content-between h-100">
                <h3 class="mb-0"><i class="fa-solid fa-magnifying-glass-chart me-3"></i>Correlations</h3>
            </div>
        </div>
    </div>

    <!-- Responsive grid -->
    <div class="mb-5">
        <div class="row">
            <!-- Temperature/humidity chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TempHumScatterChart :measurementsList="viewModel.measurementsList?.results" />
            </div>

            <!-- PM2.5/PM10 chart -->
            <div class="col-lg-6 col-12 mt-5">
                <Pm25Pm10ScatterChart :measurementsList="viewModel.measurementsList?.results" />
            </div>

            <!-- Pressure/Gas chart -->
            <div class="col-lg-6 col-12 mt-5">
                <PressGasScatterChart :measurementsList="viewModel.measurementsList?.results" />
            </div>

            <!-- Temperature/Gas chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TempGasScatterChart :measurementsList="viewModel.measurementsList?.results" />
            </div>
        </div>
    </div>
</template>