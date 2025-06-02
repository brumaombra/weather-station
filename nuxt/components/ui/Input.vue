<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
    modelValue: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: 'Enter text' },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    maxlength: { type: Number, default: null }
});

// Emits
const emit = defineEmits(['update:modelValue']);

// Local state for input value
const inputValue = ref(props.modelValue);

// Watch for changes in modelValue prop to update local state
watch(() => props.modelValue, (newValue) => {
    inputValue.value = newValue;
});

// Handle input
const handleInput = event => {
    inputValue.value = event.target.value;
    emit('update:modelValue', inputValue.value);
};
</script>

<template>
    <input :type="props.type" v-model="inputValue" @input="handleInput" :disabled="props.disabled" :readonly="props.readonly" :maxlength="props.maxlength" class="w-full py-3.5 pl-4 pr-4 text-sm font-medium bg-white text-gray-700 border-2 border-gray-100 rounded-xl appearance-none transition-all duration-200 outline-none hover:border-gray-200 focus:border-gray-200" :placeholder="props.placeholder" />
</template>