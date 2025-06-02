<script setup>
// props
const props = defineProps({
    title: { type: String, required: true }
});
</script>

<template>
    <h2 class="text-2xl font-bold mb-4 dark:text-neutral-200">{{ props.title }}</h2>
</template>