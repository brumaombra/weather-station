<script setup>
// Props
const props = defineProps({
    value: { type: Number, default: 0 }
});
</script>

<template>
    <div>
        <!-- Less than 0 -->
        <span v-if="props.value < 0" class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md shadow-red-500/25 group-hover:shadow-lg group-hover:shadow-red-500/30 transition-all duration-300">
            <i class="fa-solid fa-arrow-trend-down text-xs"></i>
            <span class="text-xs font-bold">{{ Math.abs(props.value) }}%</span>
        </span>

        <!-- Greater than 0 -->
        <span v-else-if="props.value > 0" class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-500/25 group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
            <i class="fa-solid fa-arrow-trend-up text-xs"></i>
            <span class="text-xs font-bold">{{ Math.abs(props.value) }}%</span>
        </span>

        <!-- Equal to 0 -->
        <span v-else class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 dark:from-neutral-500 dark:to-neutral-600 text-white shadow-md shadow-gray-400/25 group-hover:shadow-lg group-hover:shadow-gray-400/30 transition-all duration-300">
            <i class="fa-solid fa-minus text-xs"></i>
            <span class="text-xs font-bold">UNCH</span>
        </span>
    </div>
</template>