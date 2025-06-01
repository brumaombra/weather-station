<script setup>
import { computed } from 'vue';
import { getPercentageDifference, cloneObject } from '~/composables/useUtils.js';
import LineChartOptions from '~/utils/chartConfigs/lineChart.js';
import ChartCard from '~/components/ChartCard.vue';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: () => [] }
});

// Computed chart options and series
const chartOptions = computed(() => {
    const options = cloneObject(LineChartOptions);
    const measurements = props.measurementsList;
    if (!measurements.length) return options;

    // Prepare data for the chart
    const labels = [], average = [], max = [], min = [];
    for (const measurement of measurements) {
        labels.push(measurement.date);
        average.push(measurement.temperatureAvg);
        max.push(measurement.temperatureMax);
        min.push(measurement.temperatureMin);
    }

    // Set chart data
    options.xaxis.categories = labels;
    options.series = [
        { name: 'Average', data: average },
        { name: 'Max', data: max },
        { name: 'Min', data: min }
    ];

    // Return the options
    return options;
});

// Computed percentage difference
const percentageDifference = computed(() => {
    const measurements = props.measurementsList;
    if (!measurements.length) return 0;
    return getPercentageDifference(measurements[0]?.temperatureAvg, measurements.at(-1)?.temperatureAvg);
});
</script>

<template>
    <ChartCard title="Temperature" :percentage="percentageDifference" :measurements="props.measurementsList" chart-type="line" :chartSeries="chartOptions.series" :chart-options="chartOptions" />
</template>