<script setup>
import Navbar from '@/components/navbar/Navbar.vue';
import Sidebar from '@/components/navbar/Sidebar.vue';
</script>

<template>
    <!-- Navbar -->
    <Navbar />

    <!-- Sidebar -->
    <Sidebar />

    <!-- Content -->
    <div class="w-full lg:ps-64">
        <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
            <RouterView />
        </div>
    </div>
</template>