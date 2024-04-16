<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import GlobalStore from '@/stores/store';
import { formatDate } from '@/utils/formatter.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    if (GlobalStore.measurementsListChart.length === 0) return; // If empty, exit
    const label = GlobalStore.measurementsListChart.map(item => formatDate(item.date));
    const average = GlobalStore.measurementsListChart.map(item => item.temperature.avg); // Average
    const max = GlobalStore.measurementsListChart.map(item => item.temperature.max); // Max
    const min = GlobalStore.measurementsListChart.map(item => item.temperature.min); // Mix
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
watch(() => GlobalStore.measurementsListChart, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-droplet me-3 text-primary"></i>Humidity</h3>
    <canvas id="humidityLineChart"></canvas>
</template>