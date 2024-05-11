<script setup>
import { onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';
import CorrelationsStore from '@/stores/correlations.js';
import { setResponsiveChartSize } from '@/utils/utils.js';

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('humPm1ScatterChart'); // Set the size of the chart
    const measurements = CorrelationsStore.measurementsList?.results || []; // Measurements list
    const data = measurements.map(item => ({
        x: item.humidity,
        y: item.pm1
    }));
    const parameters = { // Chart parameters
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Humidity vs PM1',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 1)'
            }]
        }
    };

    // Create chart
    const chartDom = document.getElementById('humPm1ScatterChart'); // Get the DOM element
    if (chart) chart.destroy(); // Destroy the current chart
    chart = new Chart(chartDom, parameters); // Create the chart
};

// On mounted event
onMounted(() => {
    createChart(); // Create the chart
});

// Watch the property for changes
watch(() => CorrelationsStore.measurementsList, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-droplet me-3 custom-light-blue-text"></i>Humidity vs PM1<i class="fa-solid fa-hill-rockslide ms-3 custom-grey-text"></i></h3>
    <canvas id="humPm1ScatterChart"></canvas>
</template>