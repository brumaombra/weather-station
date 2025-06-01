<script setup>
import { computed } from 'vue';
import { cloneObject } from '~/composables/useUtils.js';
import ScatterChartOptions from '~/utils/chartConfigs/scatterChart.js';
import ChartCard from '~/components/ChartCard.vue';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: () => [] },
    title: { type: String, default: '' },
    xKey: { type: String, required: true },
    yKey: { type: String, required: true }
});

// Computed chart options and series
const chartOptions = computed(() => {
    const options = cloneObject(ScatterChartOptions);
    const measurements = props.measurementsList || [];
    if (!measurements.length) return options;

    // Prepare data for the chart
    const data = measurements.map(item => [item[props.xKey], item[props.yKey]]);
    options.series = [{
        name: 'Correlation',
        data: data
    }];

    // Return the options
    return options;
});
</script>

<template>
    <ChartCard :title="title"
        :measurements="measurementsList"
        chart-type="scatter"
        :chartSeries="chartOptions.series"
        :chart-options="chartOptions" />
</template>