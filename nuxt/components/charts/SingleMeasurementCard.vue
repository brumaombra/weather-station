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
            <div class="relative flex-shrink-0 flex justify-center items-center size-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                <i :class="[props.icon, 'relative z-10 text-lg text-white drop-shadow-sm']"></i>
            </div>

            <div class="grow space-y-2">
                <!-- Title -->
                <div class="flex items-center gap-x-2">
                    <p class="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400 group-hover:text-gray-700 dark:group-hover:text-neutral-300 transition-colors duration-300">{{ props.title }}</p>
                    <div class="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-neutral-600"></div>
                </div>

                <!-- Value and percentage difference -->
                <div class="flex items-center gap-x-3">
                    <div class="flex items-baseline gap-x-1">
                        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                            {{ formatUnitNumber(props.value, 1) }}
                        </h3>
                        <span class="text-sm font-medium text-gray-500 dark:text-neutral-400">{{ props.unit }}</span>
                    </div>

                    <!-- Less than 0 -->
                    <span v-if="percentageDifference < 0" class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md shadow-red-500/25 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
                        <i class="fa-solid fa-arrow-trend-down text-xs"></i>
                        <span class="text-xs font-bold">{{ Math.abs(percentageDifference) }}%</span>
                    </span>

                    <!-- Greater than 0 -->
                    <span v-else-if="percentageDifference > 0" class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/25 group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
                        <i class="fa-solid fa-arrow-trend-up text-xs"></i>
                        <span class="text-xs font-bold">{{ Math.abs(percentageDifference) }}%</span>
                    </span>

                    <!-- Equal to 0 -->
                    <span v-else class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-neutral-500 dark:to-neutral-600 text-white shadow-md shadow-gray-400/25 group-hover:shadow-lg group-hover:shadow-gray-400/30 transition-all duration-300">
                        <i class="fa-solid fa-minus text-xs"></i>
                        <span class="text-xs font-bold">UNCH</span>
                    </span>
                </div>
            </div>
        </div>
    </Card>
</template>