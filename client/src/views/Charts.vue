<script setup>
import TemperatureLineChart from '@/components/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/HumidityLineChart.vue';
import GlobalStore from '@/stores/store.js';
import { getAggregatedMeasurements, setBusy } from '@/utils/utils';

// Load the measurements
const loadMeasurements = params => {
    setBusy(true); // Busy on
    let parameters = params || {};
    parameters.period = parameters.period || 'D'; // Set default period
    parameters.orderDirection = parameters.orderDirection || 'asc'; // Set default order

    // Get the measurements
    getAggregatedMeasurements(data => {
        GlobalStore.measurementsListChart = data; // Save the loaded measurements
        setBusy(false); // Busy off
    }, error => {
        setBusy(false); // Busy off
    }, parameters);
};

// Init function
const init = () => {
    if (GlobalStore.measurementsListChart.length > 0) return; // If already done, exit
    loadMeasurements(); // Load the measurements
};

// When period select changed
const handlePeriodChange = event => {
    const selectedValue = event.target?.value || null;
    loadMeasurements({ // Load the measurements
        period: selectedValue
    });
};

init(); // Call init function

</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex mb-4-5 align-items-center justify-content-between">
        <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Charts</h3>

        <!-- Periods select -->
        <select class="form-select w-auto" @change="handlePeriodChange">
            <!-- <option value="D" selected>Last day</option> -->
            <option value="W" selected>Last week</option>
            <option value="M">Last month</option>
            <option value="Y">Last year</option>
        </select>
    </div>

    <!-- Container responsive -->
    <div class="row">
        <!-- Temperature chart -->
        <div class="col-6">
            <TemperatureLineChart />
        </div>

        <!-- Humidity chart -->
        <div class="col-6">
            <HumidityLineChart />
        </div>
    </div>
</template>