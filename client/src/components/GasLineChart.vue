<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import GlobalStore from '@/stores/global.js';
import { formatTimestampChart } from '@/utils/formatter.js';

let chart = null; // The chart element

// Set the size of the chart
const setChartSize = () => {
    if (window.innerWidth < 992) { // Only if mobile
        const chartDom = document.getElementById('gasLineChart'); // Get the DOM element
        chartDom.width = 800; // Set the width of the canvas
        chartDom.height = 600; // Set the height of the canvas
    }
};

// Create the chart
const createChart = () => {
    setChartSize(); // Set the size of the chart
    const measurements = GlobalStore.measurementsListChart.results || []; // Measurements list
    const label = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.gasAvg); // Average
    const max = measurements.map(item => item.gasMax); // Max
    const min = measurements.map(item => item.gasMin); // Mix
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
    const chartDom = document.getElementById('gasLineChart'); // Get the DOM element
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
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-smog me-3 text-info"></i>Gas</h3>
    <canvas id="gasLineChart"></canvas>
</template>