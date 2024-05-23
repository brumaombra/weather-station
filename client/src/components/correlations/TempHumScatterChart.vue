<script setup>
import { onMounted, watch, defineProps } from 'vue';
// import Chart from 'chart.js/auto';
import { setResponsiveChartSize } from '@/utils/utils.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('tempHumScatterChart'); // Set the size of the chart
    const measurements = props.measurementsList || []; // Measurements list
    const data = measurements.map(item => ({
        x: item.temperature,
        y: item.humidity
    }));
    const parameters = { // Chart parameters
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Temperature vs Humidity',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 1)'
            }]
        }
    };

    // Create chart
    const chartDom = document.getElementById('tempHumScatterChart'); // Get the DOM element
    if (chart) chart.destroy(); // Destroy the current chart
    chart = new Chart(chartDom, parameters); // Create the chart
};

// On mounted event
onMounted(() => {
    createChart(); // Create the chart
});

// Watch the property for changes
watch(() => props.measurementsList, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-temperature-half me-3 custom-red-text"></i>Temperature vs Humidity<i class="fa-solid fa-droplet ms-3 custom-light-blue-text"></i></h3>
    <canvas id="tempHumScatterChart"></canvas>
</template>