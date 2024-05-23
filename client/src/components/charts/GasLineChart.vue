<script setup>
import { onMounted, watch, defineProps } from 'vue';
// import Chart from 'chart.js/auto';
import { formatTimestampChart } from '@/utils/formatter.js';
import { setResponsiveChartSize } from '@/utils/utils.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('gasLineChart'); // Set the size of the chart
    const measurements = props.measurementsList || []; // Measurements list
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
watch(() => props.measurementsList, () => {
    createChart(); // Create the chart
});
</script>

<template>
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-smog me-3 custom-brown-text"></i>Gas</h3>
    <canvas id="gasLineChart"></canvas>
</template>