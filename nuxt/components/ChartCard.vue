<script setup>
import { defineAsyncComponent } from 'vue';
import Card from '~/components/Card.vue';
import PercentageChange from '~/components/ui/PercentageChange.vue';

// Lazy load VueApexCharts component only on client-side
const VueApexCharts = defineAsyncComponent(() =>
    import('vue3-apexcharts').then(mod => mod.default)
);

// Props
const props = defineProps({
    title: { type: String, default: '' },
    percentage: { type: Number, default: null },
    measurements: { type: Array, default: () => [] },
    chartType: { type: String, default: 'line' },
    chartSeries: { type: Array, default: () => [] },
    chartOptions: { type: Object, default: () => { } }
});
</script>

<template>
    <Card>
        <!-- Header -->
        <div class="flex justify-between items-center mb-2 pb-4 border-b border-gray-100 dark:border-neutral-700">
            <div class="flex items-center gap-x-3">
                <div class="flex-shrink-0 w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                <h2 class="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">{{ props.title }}</h2>
            </div>
            <div v-if="props.percentage !== null" class="flex-shrink-0">
                <PercentageChange :value="props.percentage" />
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