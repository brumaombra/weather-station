<script setup>
// Props
const props = defineProps({
    show: { type: Boolean, default: false },
    title: { type: String, default: 'Anomalous value, 2 standard deviations from the norm' }
});
</script>

<template>
    <div v-if="props.show" class="flex items-center justify-center w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-full">
        <i class="fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400 text-xs" :title="props.title"></i>
    </div>
</template>