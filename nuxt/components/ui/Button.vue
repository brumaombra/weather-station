<script setup>
// Props
const props = defineProps({
    text: { type: String, required: true },
    type: { type: String, default: 'primary' },
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
    <button v-if="props.type === 'primary'" type="button" @click="handleClick" :disabled="props.disabled" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer disabled:pointer-events-none">
        <i v-if="props.icon" :class="props.icon"></i>{{ props.text }}<i v-if="props.iconEnd" :class="props.iconEnd"></i>
    </button>

    <!-- Secondary -->
    <button v-if="props.type === 'secondary'" type="button" @click="handleClick" :disabled="props.disabled" class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-bold rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 cursor-pointer disabled:pointer-events-none">
        <i v-if="props.icon" :class="props.icon"></i>{{ props.text }}<i v-if="props.iconEnd" :class="props.iconEnd"></i>
    </button>
</template>