<script setup>
import { onMounted } from 'vue';
import Chart from 'chart.js/auto';
import GlobalStore from '@/stores/store';
import { timestampFormatter } from '@/utils/formatter.js';

// Chart parameters
const label = GlobalStore.measurementsList.map(item => timestampFormatter(item.timestamp));
const data = GlobalStore.measurementsList.map(item => item.humidity);
const parameters = {
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

// On mounted event
onMounted(() => {
    const chartDom = document.getElementById('humidityLineChart'); // Get the DOM element
    new Chart(chartDom, parameters); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-droplet me-3 text-primary"></i>Humidity</h3>
    <canvas id="humidityLineChart"></canvas>
</template>