<script setup>
import TemperatureHumidityCorrelationChart from '@/components/TemperatureHumidityCorrelationChart.vue';
import ForecastsStore from '@/stores/forecasts.js';
import { getTempHumCorrData, setBusy, showToast } from '@/utils/utils.js';

// View model
const viewModel = ForecastsStore;

// Load the measurements
const loadTempHumCorrData = async () => {
    setBusy(true); // Busy on
    try { // Try to get the data
        const results = await getTempHumCorrData(); //  Get the data
        viewModel.tempHumCorrData = results; // Save the loaded measurements
        setBusy(false); // Busy off
    } catch (error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while reading the data', { cause: error }); // Save the old error to the stack
        showToast(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Init function
const init = () => {
    if (viewModel.initDone) return; // If already done, exit
    viewModel.initDone = true; // Mark as executed
    loadTempHumCorrData(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Toolbar -->
    <div class="row">
        <div class="col-md-6 col-12">
            <!-- Title -->
            <div class="d-flex align-items-center justify-content-between h-100">
                <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Correlations</h3>
            </div>
        </div>
    </div>

    <!-- Responsive grid -->
    <div class="mb-5">
        <div class="row">
            <!-- Temperature/humidity chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TemperatureHumidityCorrelationChart />
            </div>
        </div>
    </div>
</template>