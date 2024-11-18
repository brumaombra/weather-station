<script setup>
import { ref } from 'vue';

// Check if the screen is mobile
const isMobile = ref(window.innerWidth < 1024);
</script>

<template>
    <div id="application-sidebar" class="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform w-[260px] hidden fixed inset-y-0 start-0 z-[60] bg-white border-e border-gray-200 lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 dark:bg-neutral-800 dark:border-neutral-500">
        <div class="px-8 pt-4">
            <!-- Logo -->
            <div class="flex items-center justify-center text-xl font-bold dark:text-neutral-200">
                Weather Station<i class="fa-solid fa-cloud-sun-rain ms-2 text-blue-600"></i>
            </div>
        </div>

        <!-- Page list -->
        <nav class="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
            <ul class="space-y-1.5">
                <li>
					<router-link to="/dashboard/snapshot" class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700" active-class="bg-gray-100 dark:bg-neutral-700" :data-hs-overlay="isMobile ? '#application-sidebar' : null">
                        <i class="fa-solid fa-camera text-base"></i>Snapshot
					</router-link>
				</li>
                <li>
					<router-link to="/dashboard/measurements" class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700" active-class="bg-gray-100 dark:bg-neutral-700" :data-hs-overlay="isMobile ? '#application-sidebar' : null">
						<i class="fa-solid fa-table text-base"></i>Measurements
					</router-link>
				</li>
                <li>
					<router-link to="/dashboard/charts" class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700" active-class="bg-gray-100 dark:bg-neutral-700" :data-hs-overlay="isMobile ? '#application-sidebar' : null">
						<i class="fa-solid fa-chart-line text-base"></i>Charts
					</router-link>
				</li>
                <li>
					<router-link to="/dashboard/correlations" class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700" active-class="bg-gray-100 dark:bg-neutral-700" :data-hs-overlay="isMobile ? '#application-sidebar' : null">
						<i class="fa-solid fa-magnifying-glass-chart text-base"></i>Correlations
					</router-link>
				</li>
                <!-- <li>
					<router-link to="/dashboard/forecasts" class="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700" active-class="bg-gray-100 dark:bg-neutral-700">
						<i class="fa-solid fa-mask text-base"></i>Forecasts
					</router-link>
				</li> -->
            </ul>
        </nav>
    </div>
</template>