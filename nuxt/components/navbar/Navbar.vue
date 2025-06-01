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
        <header class="fixed top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-900/80 dark:border-neutral-700 z-30 min-h-[65px]">
            <nav class="flex basis-full items-center w-full mx-auto px-4 sm:px-6">
                <!-- Mobile section -->
                <div class="me-5 lg:me-0 lg:hidden">
                    <button type="button" class="p-2 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200" @click="toggleSidebar">
                        <i class="fa-solid fa-bars text-lg"></i>
                    </button>
                </div>
            </nav>
        </header>

        <!-- Padding to prevent content from going under the navbar -->
        <div class="pt-[65px]"></div>
    </div>
</template>