<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import GlobalStore from '@/stores/store';
import { formatDate } from '@/utils/formatter.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    const measurements = GlobalStore.measurementsListChart.results || []; // Measurements list
    const label = measurements.map(item => formatDate(item.date)); // Label
    const average = measurements.map(item => item.temperatureAvg); // Average
    const max = measurements.map(item => item.temperatureMax); // Max
    const min = measurements.map(item => item.temperatureMin); // Mix
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
    const chartDom = document.getElementById('temperatureLineChart'); // Get the DOM element
    if (chart) chart.destroy(); // Destroy the current chart
    chart = new Chart(chartDom, parameters); // Create the chart
};

// On mounted event
onMounted(() => {
    createChart(); // Create the chart
});

// Watch the property for changes
watch(() => GlobalStore.measurementsListChart, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-temperature-half me-3 text-danger"></i>Temperature</h3>
    <canvas id="temperatureLineChart"></canvas>
</template>