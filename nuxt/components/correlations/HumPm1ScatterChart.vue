<script setup>
import { onMounted, watch, reactive } from 'vue';
import { cloneObject } from '~/composables/useUtils.js';
import ScatterChartOptions from '~/utils/chartConfigs/scatterChart.js';
import ChartCard from '~/components/ChartCard.vue';

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
    const data = measurements.map(item => ([item.humidity, item.pm1]));
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
    <ChartCard
        title="Humidity/PM1"
        :measurements="props.measurementsList"
        chart-type="scatter"
        :chartSeries="options.series"
        :chartOptions="options"
    />
</template>