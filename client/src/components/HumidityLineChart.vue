<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import GlobalStore from '@/stores/store';
import { formatTimestamp } from '@/utils/formatter.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    const label = GlobalStore.measurementsListChart.map(item => formatTimestamp(item.timestamp));
    const data = GlobalStore.measurementsListChart.map(item => item.humidity);
    const parameters = { // Chart parameters
        type: 'line',
        data: {
            labels: label,
            datasets: [{
                label: 'Humidity',
                data: data,
                fill: true,
                backgroundColor: 'rgb(13, 110, 253, 0.05)',
                borderColor: 'rgb(13, 110, 253)',
                tension: 0.5
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
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
    createChart(); // Create the chart5
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-droplet me-3 text-primary"></i>Humidity</h3>
    <canvas id="humidityLineChart"></canvas>
</template>