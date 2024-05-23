<script setup>
import { onMounted, watch, ref } from 'vue';
import { formatTimestampChart } from '@/utils/formatter.js';

// Props
const props = defineProps({
    measurementsList: { type: Array, default: [] }
});

// Chart options
const options = ref({
    chart: {
        height: 300,
        type: 'area',
        toolbar: {
            show: false
        }, zoom: {
            enabled: false
        }
    }, legend: {
        show: false
    }, dataLabels: {
        enabled: false
    }, stroke: {
        curve: 'smooth',
        width: 2
    }, grid: {
        strokeDashArray: 2
    }, xaxis: {
        type: 'category',
        tickPlacement: 'on',
        axisBorder: {
            show: false
        }, axisTicks: {
            show: false
        }, crosshairs: {
            stroke: {
              dashArray: 0
            }, dropShadow: {
              show: false
            }
        }, tooltip: {
            enabled: false
        }, labels: {
            style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
            }, formatter: (title) => {
                let t = title;
                return t;
            }
        }
    }, yaxis: {
        labels: {
            align: 'left',
            minWidth: 0,
            maxWidth: 140,
            style: {
                colors: '#9ca3af',
                fontSize: '13px',
                fontFamily: 'Inter, ui-sans-serif',
                fontWeight: 400
            }, formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
        }
    }, tooltip: {
        x: {
            format: 'MMMM yyyy'
        }, y: {
            formatter: (value) => `${value >= 1000 ? `${value / 1000}k` : value}`
        }
    }, responsive: [{
        breakpoint: 568,
        options: {
            chart: {
                height: 300
            }, labels: {
                style: {
                    colors: '#9ca3af',
                    fontSize: '11px',
                    fontFamily: 'Inter, ui-sans-serif',
                    fontWeight: 400
                },
                offsetX: -2,
                formatter: (title) => title.slice(0, 3)
            }, yaxis: {
                labels: {
                    align: 'left',
                    minWidth: 0,
                    maxWidth: 140,
                    style: {
                        colors: '#9ca3af',
                        fontSize: '11px',
                        fontFamily: 'Inter, ui-sans-serif',
                        fontWeight: 400
                    },
                    formatter: (value) => value >= 1000 ? `${value / 1000}k` : value
                }
            }
        }
    }]
});

// Chart data
const series = ref([]);

// Create the chart
const createChart = () => {
    const measurements = props.measurementsList || []; // Measurements list
    const labels = measurements.map(item => formatTimestampChart(item.date)); // Label
    const average = measurements.map(item => item.temperatureAvg); // Average
    const max = measurements.map(item => item.temperatureMax); // Max
    const min = measurements.map(item => item.temperatureMin); // Mix

    // Set chart data
    options.value.xaxis.categories = labels;
    series.value = [{
        name: 'Average',
        data: average
    }, {
        name: 'Max',
        data: max
    }, {
        name: 'Min',
        data: min
    }];
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
    <div class="p-4 md:p-5 min-h-[410px] flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-sm text-gray-500 dark:text-neutral-500 mb-2">Temperature</h2>
                <p class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">21.0 °C</p>
            </div>
            <div>
                <span class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-500">
                    <i class="fa-solid fa-arrow-up-long"></i>25%
                </span>
            </div>
        </div>

        <!-- Chart -->
        <div>
            <apexchart type="line" :options="options" :series="series"></apexchart>
        </div>
    </div>
</template>