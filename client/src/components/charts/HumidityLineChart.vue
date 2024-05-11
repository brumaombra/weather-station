<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import ChartsStore from '@/stores/charts.js';
import { formatTimestampChart } from '@/utils/formatter.js';
import { setResponsiveChartSize } from '@/utils/utils.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('humidityLineChart'); // Set the size of the chart
    const measurements = ChartsStore.measurementsList?.results || []; // Measurements list
    const label = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.humidityAvg); // Average
    const max = measurements.map(item => item.humidityMax); // Max
    const min = measurements.map(item => item.humidityMin); // Mix
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
    const chartDom = document.getElementById('humidityLineChart'); // Get the DOM element
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
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-droplet me-3 custom-light-blue-text"></i>Humidity</h3>
    <canvas id="humidityLineChart"></canvas>
</template>