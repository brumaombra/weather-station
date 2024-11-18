<script setup>
import ProfileAvatar from '@/components/navbar/ProfileAvatar.vue';
</script>

<template>
    <header class="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-neutral-800 dark:border-neutral-500">
        <nav class="flex basis-full items-center w-full mx-auto px-4 sm:px-6">
            <div class="me-5 lg:me-0 lg:hidden">
                <div class="flex items-center">
                    <!-- Hamburger -->
                    <button type="button" data-hs-overlay="#application-sidebar" class="py-2 px-3 flex justify-center items-center me-4 gap-x-1.5 text-xs rounded-lg border border-gray-200 bg-white text-gray-400 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-200">
                        <i class="fa-solid fa-bars text-base"></i>
                    </button>

                    <!-- Logo -->
                    <div class="flex items-center justify-center text-xl font-bold whitespace-nowrap dark:text-neutral-200">
                        Weather Station<i class="fa-solid fa-cloud-sun-rain ms-2 text-blue-600"></i>
                    </div>
                </div>
            </div>

            <!-- Navbar -->
            <div class="w-full flex items-center justify-end ms-auto sm:gap-x-3 sm:order-3">
                <!-- Right elements -->
                <div class="flex flex-row items-center justify-end gap-2">
                    <!-- <button type="button" class="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </button>
                    
                    <button type="button" class="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none" data-hs-offcanvas="#hs-offcanvas-right">
                        <svg class="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </button> -->

                    <!-- Profile avatar -->
                    <ProfileAvatar />
                </div>
            </div>
        </nav>
    </header>
</template>