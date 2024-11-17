<script setup>
import { onMounted, watch, reactive } from 'vue';
import { cloneObject } from '@/utils/utils.js';
import ScatterChartOptions from '@/stores/chartConfigs/scatterChart.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

// Chart options
const options = reactive(cloneObject(ScatterChartOptions));

// Create the chart
const createChart = () => {
    const measurements = props.measurementsList || []; // Measurements list
    if (measurements.length === 0) return; // Exit if empty
    const data = measurements.map(item => ([item.temperature, item.humidity]));
    options.series = [{ // Set chart data
        name: 'Correlation',
        data: data
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
    <div class="p-4 md:p-5 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-500">
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-sm text-gray-500 dark:text-neutral-200">Temperature/Humidity</h2>
            </div>
        </div>

        <!-- Chart -->
        <div>
            <apexchart :key="props.measurementsList.length" type="scatter" :options="options" :series="options.series"></apexchart>
        </div>
    </div>
</template>