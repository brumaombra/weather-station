<script setup>
// props
const props = defineProps({
    title: { type: String, required: true }
});
</script>

<template>
    <h2 class="text-xl font-bold mb-4 md:mb-6">{{ props.title }}</h2>
</template>