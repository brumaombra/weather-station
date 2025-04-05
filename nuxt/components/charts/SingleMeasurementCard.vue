<script setup>
import { formatUnitNumber } from '~/utils/formatter.js';
import Card from '~/components/Card.vue';

// Props
const props = defineProps({
    title: { type: String, default: '' },
    value: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    icon: { type: String, default: 'fa-solid fa-circle' },
    percentageDifference: { type: Number, default: 0 }
});
</script>

<template>
    <Card>
        <div class="flex gap-x-4 items-center">
            <!-- Icon -->
            <div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-700">
                <i :class="[props.icon, 'flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400']"></i>
            </div>
            <div class="grow">
                <!-- Title -->
                <div class="flex items-center gap-x-2">
                    <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">{{ props.title }}</p>
                </div>

                <!-- Value and percentage difference -->
                <div class="mt-1 flex items-center gap-x-2">
                    <h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.value, 1) }} <span class="text-sm font-light">{{ props.unit }}</span></h3>
                    <span v-if="percentageDifference < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
                        <i class="fa-solid fa-arrow-trend-down text-xs"></i>
                        <span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference) }} %</span>
                    </span>
                    <span v-else class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
                        <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                        <span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference) }} %</span>
                    </span>
                </div>
            </div>
        </div>
    </Card>
</template>