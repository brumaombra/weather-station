<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartsStore from '@/stores/charts.js';
import { formatTimestampChart } from '@/utils/formatter.js';
import { setResponsiveChartSize } from '@/utils/utils.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('pm10LineChart'); // Set the size of the chart
    const measurements = ChartsStore.measurementsList?.results || []; // Measurements list
    const label = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.pm10Avg); // Average
    const max = measurements.map(item => item.pm10Max); // Max
    const min = measurements.map(item => item.pm10Min); // Mix
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
    const chartDom = document.getElementById('pm10LineChart'); // Get the DOM element
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
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-hill-rockslide me-3 custom-grey-3-text"></i>PM10</h3>
    <canvas id="pm10LineChart"></canvas>
</template>