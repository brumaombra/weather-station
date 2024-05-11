<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartsStore from '@/stores/charts.js';
import { formatTimestampChart } from '@/utils/formatter.js';
import { setResponsiveChartSize } from '@/utils/utils.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('pressureLineChart'); // Set the size of the chart
    const measurements = ChartsStore.measurementsList?.results || []; // Measurements list
    const label = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.pressureAvg); // Average
    const max = measurements.map(item => item.pressureMax); // Max
    const min = measurements.map(item => item.pressureMin); // Mix
    const parameters = { // Chart parameters
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Average',
                data: average,
                borderColor: 'rgb(32, 191, 107)',
                tension: 0.5
            }, {
                label: 'Max',
                data: max,
                borderColor: 'rgb(220, 53, 69, 0.2)',
                tension: 0.5
            }, {
                label: 'Min',
                data: min,
                borderColor: 'rgb(13, 110, 253, 0.2)',
                tension: 0.5
            }]
        }
    };

    // Create chart
    const chartDom = document.getElementById('pressureLineChart'); // Get the DOM element
    if (chart) chart.destroy(); // Destroy the current chart
    chart = new Chart(chartDom, parameters); // Create the chart
};

// On mounted event
onMounted(() => {
    createChart(); // Create the chart
});

// Watch the property for changes
watch(() => ChartsStore.measurementsList, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-gauge-high me-3 custom-yellow-text"></i>Pressure</h3>
    <canvas id="pressureLineChart"></canvas>
</template>