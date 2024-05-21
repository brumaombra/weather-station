<script setup>
import GlobalStore from '@/stores/global.js'; 
</script>

<template>
    <!-- Invisible button -->
    <button id="globalMessageDialogButton" type="button" data-hs-overlay="#globalMessageDialog" class="hidden"></button>

    <!-- Modal -->
    <div id="globalMessageDialog" class="hs-overlay hidden size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all md:max-w-2xl md:w-full m-3 md:mx-auto">
            <div class="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
                <div class="p-4 sm:p-10 overflow-y-auto">
                    <div class="flex gap-x-4 md:gap-x-7">
                        <!-- Error icon -->
                        <span v-if="GlobalStore.dialog.type === 'error'" class="flex-shrink-0 inline-flex justify-center items-center size-[46px] sm:w-[62px] sm:h-[62px] rounded-full border-4 border-red-50 bg-red-100 text-red-500 flex justify-center items-center">
                            <i class="fa-solid fa-circle-exclamation custom-red-text text-xl" ></i>
                        </span>

                        <!-- Success icon -->
                        <span v-if="GlobalStore.dialog.type === 'success'" class="flex-shrink-0 inline-flex justify-center items-center size-[46px] sm:w-[62px] sm:h-[62px] rounded-full border-4 border-green-50 bg-green-100 text-green-500 flex justify-center items-center">
                            <i class="fa-solid fa-circle-check text-success text-xl"></i>
                        </span>

                        <!-- Text -->
                        <div class="grow">
                            <h3 class="mb-2 text-xl font-bold text-gray-800">{{ GlobalStore.dialog.title }}</h3>
                            <p class="text-gray-500">{{ GlobalStore.dialog.message }}</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end items-center gap-x-2 py-3 px-4 bg-gray-50 border-t">
                    <button type="button" class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none" data-hs-overlay="#globalMessageDialog">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>