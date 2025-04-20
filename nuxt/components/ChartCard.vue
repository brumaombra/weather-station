<script setup>
import { defineAsyncComponent } from 'vue';
import Card from '~/components/Card.vue';

// Lazy load VueApexCharts component only on client-side
const VueApexCharts = defineAsyncComponent(() =>
    import('vue3-apexcharts').then(mod => mod.default)
);

// Props
const props = defineProps({
    title: { type: String, default: '' },
    percentage: { type: Number, default: 0 },
    measurements: { type: Array, default: () => [] },
    chartType: { type: String, default: 'line' },
    chartSeries: { type: Array, default: () => [] },
    chartOptions: { type: Object, default: () => { } }
});
</script>

<template>
    <Card>
        <!-- Header -->
        <div class="flex justify-between items-center mb-3">
            <div>
                <h2 class="text-sm text-gray-500 dark:text-neutral-200">{{ props.title }}</h2>
            </div>
            <div>
                <!-- Greater than 0 -->
                <span v-if="props.percentage > 0" class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
                    <i class="fa-solid fa-arrow-up"></i>{{ Math.abs(props.percentage) }} %
                </span>

                <!-- Less than 0 -->
                <span v-else-if="props.percentage < 0" class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
                    <i class="fa-solid fa-arrow-down"></i>{{ Math.abs(props.percentage) }} %
                </span>

                <!-- Equal to 0 -->
                <span v-else class="py-[5px] px-[8px] inline-flex items-center gap-x-1 text-xs font-medium rounded-md bg-gray-100 text-gray-900 dark:bg-neutral-700 dark:text-neutral-200">
                    <i class="fa-solid fa-minus"></i>UNCH
                </span>
            </div>
        </div>

        <!-- Chart -->
        <div>
            <ClientOnly>
                <VueApexCharts :key="props.measurements.length" type="line" :options="props.chartOptions" :series="props.chartSeries"></VueApexCharts>
            </ClientOnly>
        </div>
    </Card>
</template>