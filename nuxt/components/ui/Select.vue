<script setup>
// Props
const props = defineProps({
    modelValue: { type: [String, Number, Object], default: '' }
});

// Emits
const emits = defineEmits(['update:modelValue', 'change']);

// Handle select change event
const handleChange = event => {
    const selectedOption = event.target.options[event.target.selectedIndex];
    if (!selectedOption) return;
    emits('update:modelValue', selectedOption._value);
    emits('change', selectedOption._value);
};
</script>

<template>
    <!-- Select container -->
    <div class="relative slide-in-up group">
        <!-- Select input -->
        <select :value="modelValue" @change="handleChange" class="w-full py-3.5 pl-4 pr-12 text-sm font-medium bg-white text-gray-700 border-2 border-gray-100 rounded-xl appearance-none cursor-pointer transition-all duration-200 outline-none hover:border-gray-200 focus:border-gray-200">
            <slot></slot>
        </select>

        <!-- Arrow icon -->
        <div class="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
            <i class="fa-solid fa-chevron-down text-base text-gray-400 transform group-hover:text-gray-500 transition-all duration-200"></i>
        </div>
    </div>
</template>