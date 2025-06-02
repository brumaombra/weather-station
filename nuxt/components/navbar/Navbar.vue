<script setup>
import Sidebar from '~/components/navbar/Sidebar.vue';

const isSidebarOpen = ref(false);

// Toggle the sidebar
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
    <div>
        <!-- Sidebar -->
        <Sidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

        <!-- Navbar -->
        <header class="fixed top-0 inset-x-0 flex flex-wrap custom-box-shadow-3 sm:justify-start sm:flex-nowrap w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-900/80 dark:border-neutral-700 z-30 min-h-[65px]">
            <nav class="flex basis-full items-center w-full mx-auto px-4 sm:px-6">
                <!-- Mobile section -->
                <div class="me-5 lg:me-0 lg:hidden">
                    <button type="button" class="relative py-3 px-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-100 hover:from-blue-100 hover:to-purple-100 hover:border-gray-200 hover:scale-105 focus:outline-none shadow-md hover:shadow-lg transition-all duration-200 dark:from-neutral-800 dark:to-neutral-700 dark:border-neutral-600 dark:hover:from-neutral-700 dark:hover:to-neutral-600" @click="toggleSidebar">
                        <i class="fa-solid fa-bars text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"></i>
                    </button>
                </div>
            </nav>
        </header>

        <!-- Padding to prevent content from going under the navbar -->
        <div class="pt-[65px]"></div>
    </div>
</template>