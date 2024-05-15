<script setup>
import { onMounted, watch, defineProps } from 'vue';
import Chart from 'chart.js/auto';
import { setResponsiveChartSize } from '@/utils/utils.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

let chart = null; // The chart element

// Create the chart
const createChart = () => {
    setResponsiveChartSize('pm25Pm10ScatterChart'); // Set the size of the chart
    const measurements = props.measurementsList || []; // Measurements list
    const data = measurements.map(item => ({
        x: item.pm25,
        y: item.pm10
    }));
    const parameters = { // Chart parameters
        type: 'scatter',
        data: {
            datasets: [{
                label: 'PM2.5 vs PM10',
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 1)'
            }]
        }
    };

    // Create chart
    const chartDom = document.getElementById('pm25Pm10ScatterChart'); // Get the DOM element
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
    <h3 class="mb-4 ms-3"><i class="fa-solid fa-hill-rockslide me-3 custom-grey-2-text"></i>PM2.5 vs PM10<i class="fa-solid fa-hill-rockslide ms-3 custom-grey-3-text"></i></h3>
    <canvas id="pm25Pm10ScatterChart"></canvas>
</template>