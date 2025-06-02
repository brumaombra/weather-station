<script setup>
import { formatUnitNumber } from '~/utils/formatter.js';
import Card from '~/components/Card.vue';
import PercentageChange from '~/components/ui/PercentageChange.vue';

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
                </div>

                <!-- Value and percentage difference -->
                <div class="flex items-center gap-x-3">
                    <div class="flex items-baseline gap-x-1">
                        <h3 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                            {{ formatUnitNumber(props.value, 1) }}
                        </h3>
                        <span class="text-sm font-medium text-gray-500 dark:text-neutral-400">{{ props.unit }}</span>
                    </div>

                    <!-- Percentage change -->
                    <PercentageChange :value="percentageDifference" />
                </div>
            </div>
        </div>
    </Card>
</template>