<script setup>
import { reactive } from 'vue';
import TemperatureLineChart from '@/components/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/HumidityLineChart.vue';
import GlobalStore from '@/stores/store.js';
import { getAggregatedMeasurements, setBusy } from '@/utils/utils';

// View model
const viewModel = reactive({
    periodSelect: 'W'
});

// Load the measurements
const loadMeasurements = () => {
    setBusy(true); // Busy on
    const params = {
        period: viewModel.periodSelect
    };

    // Get the measurements
    getAggregatedMeasurements(data => {
        GlobalStore.measurementsListChart = data; // Save the loaded measurements
        setBusy(false); // Busy off
    }, error => {
        setBusy(false); // Busy off
    }, params);
};

// Init function
const init = () => {
    if (GlobalStore.measurementsListChart.length > 0) return; // If already done, exit
    loadMeasurements(); // Load the measurements
};

// When period select changed
const handlePeriodChange = event => {
    loadMeasurements(); // Load the measurements
};

init(); // Call init function

</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex mb-4-5 align-items-center justify-content-between">
        <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Charts</h3>

        <!-- Periods select -->
        <select class="form-select w-auto" v-model="viewModel.periodSelect" @change="handlePeriodChange">
            <option value="W">Last week</option>
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