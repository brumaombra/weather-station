<script setup>
import { formatDecimal, formatUnitNumber } from '@/utils/formatter.js';

// Props
const props = defineProps({
    lastMeasurement: { type: Object, default: {} }
});
</script>

<template>
    <!-- Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4">
		<!-- Card temperature -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-temperature-half flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Temperature</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.temperature) }} °C</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card humidity -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-droplet flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Humidity</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.humidity) }} %</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card pressure -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-gauge-high flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Pressure</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pressure) }} hPa</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card gas -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-smog flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">Gas</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.gas) }} ppm</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card PM1 -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-hill-rockslide flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">PM1</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pm1) }} µg/m³</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card PM2.5 -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-hill-rockslide flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">PM2.5</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pm25) }} µg/m³</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card PM10 -->
		<div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
			<div class="p-4 md:p-5 flex gap-x-4 items-center">
				<div class="flex-shrink-0 flex justify-center items-center size-[46px] bg-gray-100 rounded-lg dark:bg-neutral-800">
					<i class="fa-solid fa-hill-rockslide flex justify-center items-center text-xl text-gray-400 dark:text-neutral-400"></i>
				</div>
				<div class="grow">
					<div class="flex items-center gap-x-2">
						<p class="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">PM10</p>
					</div>
					<div class="mt-1 flex items-center gap-x-2">
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pm10) }} µg/m³</h3>
						<span class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">1.7%</span>
						</span>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>