<script setup>
// props
const props = defineProps({
    title: { type: String, required: true },
    icon: { type: String, default: 'fa-solid fa-circle' }
});
</script>

<template>
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-5">
        <div class="flex items-center gap-5">
            <!-- Icon -->
            <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div class="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                    <i :class="[props.icon, 'text-xl text-white drop-shadow-sm']"></i>
                </div>
            </div>

            <!-- Title -->
            <div class="flex-1">
                <h1 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent tracking-tight leading-tight">
                    {{ props.title }}
                </h1>
                <div class="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2"></div>
            </div>
        </div>

        <!-- Actions slot -->
        <div v-if="$slots.actions" class="flex-shrink-0">
            <slot name="actions"></slot>
        </div>
    </div>
</template>