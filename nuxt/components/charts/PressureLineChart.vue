<script setup>
import { onMounted, watch, reactive } from 'vue';
import { getPercentageDifference, cloneObject } from '~/composables/useUtils.js';
import LineChartOptions from '~/utils/chartConfigs/lineChart.js';
import ChartCard from '~/components/ChartCard.vue';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: () => [] }
});

const options = reactive(cloneObject(LineChartOptions));
let percentageDifference = 0;

// Create the chart
const createChart = () => {
    const measurements = props.measurementsList;
    if (!measurements.length) return;

    // Prepare data for the chart
    const labels = [], average = [], max = [], min = [];
    for (const measurement of measurements) {
        labels.push(measurement.date);
        average.push(measurement.pressureAvg);
        max.push(measurement.pressureMax);
        min.push(measurement.pressureMin);
    }

    // Set chart data
    options.xaxis.categories = labels;
    options.series = [
        { name: 'Average', data: average },
        { name: 'Max', data: max },
        { name: 'Min', data: min }
    ];

    // Calculate the percentage difference
    percentageDifference = getPercentageDifference(measurements[0]?.gasAvg, measurements.at(-1)?.gasAvg);
};

// On component mounted
onMounted(() => {
    createChart();
});

// Watch for changes in the measurements list
watch(() => props.measurementsList, createChart);
</script>

<template>
    <ChartCard
        title="Pressure"
        :percentage="percentageDifference"
        :measurements="props.measurementsList"
        chart-type="line"
        :chartSeries="options.series"
        :chart-options="options"
    />
</template>