<script setup>
import { onMounted, watch, reactive } from 'vue';
import { formatTimestampChart } from '@/utils/formatter.js';
import { getPercentageDifference, cloneObject } from '@/utils/utils.js';
import LineChartOptions from '@/stores/chartConfigs/lineChart.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

// Chart data
const options = reactive(cloneObject(LineChartOptions));
let percentage = 0; // Percentage difference

// Create the chart
const createChart = () => {
    const measurements = props.measurementsList || []; // Measurements list
    if (measurements.length === 0) return; // Exit if empty
    const labels = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.pm25Avg); // Average
    const max = measurements.map(item => item.pm25Max); // Max
    const min = measurements.map(item => item.pm25Min); // Mix

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

    // Calculate the difference
    percentage = getPercentageDifference(measurements[0]?.pm25Avg, measurements[measurements.length - 1]?.pm25Avg);
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
    <div class="p-4 md:p-5 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-500">
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-sm text-gray-500 dark:text-neutral-200">PM2.5</h2>
            </div>
            <div>
                <span v-if="percentage >= 0" class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
                    <i class="fa-solid fa-arrow-up"></i>{{ Math.abs(percentage) }} %
                </span>
                <span v-if="percentage < 0" class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
                    <i class="fa-solid fa-arrow-down"></i>{{ Math.abs(percentage) }} %
                </span>
            </div>
        </div>

        <!-- Chart -->
        <div>
            <apexchart :key="props.measurementsList.length" type="line" :options="options" :series="options.series"></apexchart>
        </div>
    </div>
</template>