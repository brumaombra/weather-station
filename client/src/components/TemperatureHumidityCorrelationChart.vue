<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import ForecastsStore from '@/stores/forecasts.js';
import { formatTimestampChart } from '@/utils/formatter.js';

let chart = null; // The chart element

// Set the size of the chart
const setChartSize = () => {
    if (window.innerWidth < 992) { // Only if mobile
        const chartDom = document.getElementById('temperatureHumidityCorrelationChart'); // Get the DOM element
        chartDom.width = 800; // Set the width of the canvas
        chartDom.height = 600; // Set the height of the canvas
    }
};

// Create the chart
const createChart = () => {
    setChartSize(); // Set the size of the chart
    const measurements = ForecastsStore.tempHumCorrData || []; // Measurements list
    const label = measurements.map(item => item.temperature); // Temperature
    const data = measurements.map(item => item.humidity); // Humidity
    const parameters = { // Chart parameters
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Correlation',
                data: data,
                borderColor: 'rgb(32, 191, 107)',
                tension: 0.5
            }]
        }
    };

    // Create chart
    const chartDom = document.getElementById('temperatureHumidityCorrelationChart'); // Get the DOM element
    if (chart) chart.destroy(); // Destroy the current chart
    chart = new Chart(chartDom, parameters); // Create the chart
};

// On mounted event
onMounted(() => {
    createChart(); // Create the chart
});

// Watch the property for changes
watch(() => ForecastsStore.tempHumCorrData, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-temperature-half me-3 text-danger"></i>Temperature/Humidity Correlation</h3>
    <canvas id="temperatureHumidityCorrelationChart"></canvas>
</template>