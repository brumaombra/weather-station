<script setup>
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

// init(); // Call init function
</script>

<template>
    <div class="d-flex justify-content-center">
        <h1>Coming soon...</h1>
    </div>
</template>