<script setup>
import Navbar from '~/components/navbar/Navbar.vue';
</script>

<template>
    <div class="bg-gray-50/70 dark:bg-neutral-900 min-h-screen">
        <!-- Navbar -->
        <Navbar />

        <!-- Content -->
        <div class="w-full lg:ps-64">
            <div class="max-w-[85rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                <slot></slot>
            </div>
        </div>
    </div>
</template>