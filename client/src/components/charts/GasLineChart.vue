<script setup>
import { onMounted, watch } from 'vue';
import { formatTimestampChart } from '@/utils/formatter.js';
import LineChartOptions from '@/stores/chartConfigs/lineChart.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

// Chart data
const options = LineChartOptions;

// Create the chart
const createChart = () => {
    const measurements = props.measurementsList || []; // Measurements list
    if (measurements.length === 0) return; // Exit if empty
    const labels = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.gasAvg); // Average
    const max = measurements.map(item => item.gasMax); // Max
    const min = measurements.map(item => item.gasMin); // Mix

    // Set chart data
    options.xaxis.categories = labels;
    options.series = [{
        name: 'Average',
        data: average
    }, {
        name: 'Max',
        data: max
    }, {
        name: 'Min',
        data: min
    }];
};

// On mounted event
onMounted(() => {
    createChart(); // Create the chart
});

// Watch the property for changes
watch(() => props.measurementsList, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <div class="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-sm text-gray-500 dark:text-neutral-500 mb-2">Gas</h2>
                <p class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">21.0 °C</p>
            </div>
            <div>
                <span class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
                    <i class="fa-solid fa-arrow-up-long"></i>25%
                </span>
            </div>
        </div>

        <!-- Chart -->
        <div>
            <apexchart type="line" :options="options" :series="options.series"></apexchart>
        </div>
    </div>
</template>