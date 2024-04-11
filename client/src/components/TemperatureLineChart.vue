<script setup>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
import GlobalStore from '@/stores/store';
import { timestampFormatter } from '@/utils/formatter.js';

// Chart parameters
const label = GlobalStore.measurementsList.map(item => timestampFormatter(item.timestamp));
const data = GlobalStore.measurementsList.map(item => item.temperature);
const parameters = {
    type: 'line',
    data: {
        labels: label,
        datasets: [{
            label: 'Temperature',
            data: data,
            fill: true,
            backgroundColor: 'rgb(220, 53, 69, 0.05)',
            borderColor: 'rgb(220, 53, 69)',
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

// On mounted event
onMounted(() => {
    const chartDom = document.getElementById('temperatureLineChart'); // Get the DOM element
    new Chart(chartDom, parameters); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-temperature-half me-3 text-danger"></i>Temperature</h3>
    <canvas id="temperatureLineChart"></canvas>
</template>