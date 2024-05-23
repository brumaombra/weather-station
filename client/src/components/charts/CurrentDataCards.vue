<script setup>
import { formatDecimal } from '@/utils/formatter.js';

// Props
const props = defineProps({
    lastMeasurement: { type: Object, default: {} }
});
</script>

<template>
    <!-- Grid -->
	<h5 class="mb-3">Real-time data</h5>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
		<!-- Card temperature -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Temperature</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.temperature, 1) }} °C</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Card humidity -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Humidity</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.humidity, 1) }} %</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Card pressure -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Pressure</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.pressure, 1) }} hPa</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Card gas -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Gas</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.gas, 1) }} ppm</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Card pm1 -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">PM1</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.pm1, 1) }} µg/m³</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Card pm25 -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">PM2.5</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.pm25, 1) }} µg/m³</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Card pm10 -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
			<div class="p-4 md:p-5">
				<div class="flex items-center gap-x-2">
					<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">PM10</p>
				</div>
				<div class="mt-1 flex items-center gap-x-2">
					<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatDecimal(props.lastMeasurement?.pm10, 1) }} µg/m³</h3>
					<span class="flex items-center gap-x-1 text-red-600">
						<i class="fa-solid fa-arrow-trend-down"></i>
						<span class="inline-block text-sm">1.7%</span>
					</span>
				</div>
			</div>
		</div>
    </div>
</template>