<script setup>
// Props
const props = defineProps({
    text: { type: String, required: true },
    type: { type: String, value: 'primary', validator: value => ['primary', 'secondary'].includes(value) },
    disabled: { type: Boolean, default: false },
    icon: { type: String, default: '' },
    iconEnd: { type: String, default: '' }
});

// Emits
const emits = defineEmits(['click']);

// Handle click
const handleClick = () => {
    emits('click');
};
</script>

<template>
    <!-- Primary -->
    <button v-if="props.type === 'primary'" type="button" @click="handleClick" :disabled="props.disabled" class="relative py-4 px-6 inline-flex items-center gap-x-2 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-103 disabled:opacity-50 cursor-pointer disabled:pointer-events-none transition-all duration-300 ease-out">
        <i v-if="props.icon" :class="[props.icon, 'relative z-10']"></i>
        <span class="relative z-10">{{ props.text }}</span>
        <i v-if="props.iconEnd" :class="[props.iconEnd, 'relative z-10']"></i>
    </button>

    <!-- Secondary -->
    <button v-if="props.type === 'secondary'" type="button" @click="handleClick" :disabled="props.disabled" class="relative py-4 px-6 inline-flex items-center gap-x-2 text-sm font-bold rounded-xl border border-gray-100 bg-white text-gray-800 shadow-md hover:shadow-lg hover:scale-103 disabled:opacity-50 cursor-pointer disabled:pointer-events-none transition-all duration-300 ease-out dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:shadow-neutral-900/30">
        <i v-if="props.icon" :class="props.icon"></i>
        <span>{{ props.text }}</span>
        <i v-if="props.iconEnd" :class="props.iconEnd"></i>
    </button>
</template>