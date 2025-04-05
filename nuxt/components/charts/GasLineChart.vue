<script setup>
import { onMounted, watch, reactive } from 'vue';
import { formatTimestampChart } from '~/utils/formatter.js';
import { getPercentageDifference, cloneObject } from '~/composables/useUtils.js';
import LineChartOptions from '~/utils/chartConfigs/lineChart.js';
import ChartCard from '~/components/ChartCard.vue';

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

    // Calculate the difference
    percentage = getPercentageDifference(measurements[0]?.gasAvg, measurements[measurements.length - 1]?.gasAvg);
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
        title="Gas"
        :percentage="percentage"
        :measurements="props.measurementsList"
        chart-type="line"
        :chartSeries="options.series"
        :chartOptions="options"
    />
</template>