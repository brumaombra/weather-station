<script setup>
import { watch } from 'vue';
import { formatUnitNumber } from '@/utils/formatter.js';
import { getPercentageDifference } from '@/utils/utils.js';
import ChartsStore from '@/stores/charts.js';

// Props
const props = defineProps({
    lastMeasurement: { type: Object, default: {} }
});

// Percentage difference
const percentageDifference = ChartsStore.currentDataCards.percentageDifference;

// Calculate the percentages
const calculatePercentageDifference = () => {
	percentageDifference.temperature = getPercentageDifference(props.lastMeasurement?.lastWeek?.temperature, props.lastMeasurement?.temperature);
	percentageDifference.humidity = getPercentageDifference(props.lastMeasurement?.lastWeek?.humidity, props.lastMeasurement?.humidity);
	percentageDifference.pressure = getPercentageDifference(props.lastMeasurement?.lastWeek?.pressure, props.lastMeasurement?.pressure);
	percentageDifference.gas = getPercentageDifference(props.lastMeasurement?.lastWeek?.gas, props.lastMeasurement?.gas);
	percentageDifference.pm1 = getPercentageDifference(props.lastMeasurement?.lastWeek?.pm1, props.lastMeasurement?.pm1);
	percentageDifference.pm25 = getPercentageDifference(props.lastMeasurement?.lastWeek?.pm25, props.lastMeasurement?.pm25);
	percentageDifference.pm10 = getPercentageDifference(props.lastMeasurement?.lastWeek?.pm10, props.lastMeasurement?.pm10);
};

// Watch the property for changes
watch(() => props.lastMeasurement, () => {
    calculatePercentageDifference(); // Calculate the percentages
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.temperature, 1) }} <span class="text-sm font-light">°C</span></h3>
						<span v-if="percentageDifference.temperature < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.temperature) }} %</span>
						</span>
						<span v-if="percentageDifference.temperature >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.temperature) }} %</span>
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.humidity, 1) }} <span class="text-sm font-light">%</span></h3>
						<span v-if="percentageDifference.humidity < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.humidity) }} %</span>
						</span>
						<span v-if="percentageDifference.humidity >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.humidity) }} %</span>
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pressure, 1) }} <span class="text-sm font-light">hPa</span></h3>
						<span v-if="percentageDifference.pressure < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pressure) }} %</span>
						</span>
						<span v-if="percentageDifference.pressure >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pressure) }} %</span>
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.gas, 1) }} <span class="text-sm font-light">kOhm</span></h3>
						<span v-if="percentageDifference.gas < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.gas) }} %</span>
						</span>
						<span v-if="percentageDifference.gas >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.gas) }} %</span>
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pm1, 0) }} <span class="text-sm font-light">µg/m³</span></h3>
						<span v-if="percentageDifference.pm1 < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pm1) }} %</span>
						</span>
						<span v-if="percentageDifference.pm1 >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pm1) }} %</span>
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pm25, 0) }} <span class="text-sm font-light">µg/m³</span></h3>
						<span v-if="percentageDifference.pm25 < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pm25) }} %</span>
						</span>
						<span v-if="percentageDifference.pm25 >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pm25) }} %</span>
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
						<h3 class="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">{{ formatUnitNumber(props.lastMeasurement?.pm10, 0) }} <span class="text-sm font-light">µg/m³</span></h3>
						<span v-if="percentageDifference.pm10 < 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100">
							<i class="fa-solid fa-arrow-trend-down text-xs text-red-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pm10) }} %</span>
						</span>
						<span v-if="percentageDifference.pm10 >= 0" class="inline-flex items-center gap-x-1 py-0.5 px-2 rounded-full bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100">
							<i class="fa-solid fa-arrow-trend-up text-xs text-green-900"></i>
							<span class="inline-block text-xs font-medium">{{ Math.abs(percentageDifference.pm10) }} %</span>
						</span>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>