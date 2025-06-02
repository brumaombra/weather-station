<script setup>
import { computed } from 'vue';
import { getPercentageDifference, cloneObject } from '~/composables/useUtils.js';
import LineChartOptions from '~/utils/chartConfigs/lineChart.js';
import ChartCard from '~/components/ChartCard.vue';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: () => [] },
    title: { type: String, default: '' },
    avgKey: { type: String, required: true },
    maxKey: { type: String, required: true },
    minKey: { type: String, required: true }
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
        average.push(measurement[props.avgKey]);
        max.push(measurement[props.maxKey]);
        min.push(measurement[props.minKey]);
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
    return getPercentageDifference(measurements[0]?.[props.avgKey], measurements.at(-1)?.[props.avgKey]);
});
</script>

<template>
    <ChartCard :title="title"
        :percentage="percentageDifference"
        :measurements="measurementsList"
        chart-type="line"
        :chartSeries="chartOptions.series"
        :chart-options="chartOptions" />
</template>