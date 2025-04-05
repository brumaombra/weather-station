<script setup>
const props = defineProps({
    visible: { type: Boolean, default: false }
});
</script>

<template>
    <div v-if="props.visible" class="fixed inset-0 bg-white/70 dark:bg-gray-900/70 z-100 flex items-center justify-center">
        <div class="animate-spin inline-block size-10 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>