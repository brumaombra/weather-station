<script setup>
import { limitDecimalNumbers } from '~/composables/useUtils.js';
import SingleMeasurementCard from '~/components/charts/SingleMeasurementCard.vue';

// Props
const props = defineProps({
	lastMeasurement: { type: Object, default: {} }
});
</script>

<template>
	<!-- Grid -->
	<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
		<!-- Temperature card -->
		<SingleMeasurementCard title="Temperature"
			:value="props.lastMeasurement?.temperature"
			unit="°C"
			icon="fa-solid fa-temperature-half"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.temperature, 2)" />

		<!-- Humidity card -->
		<SingleMeasurementCard title="Humidity"
			:value="props.lastMeasurement?.humidity"
			unit="%"
			icon="fa-solid fa-droplet"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.humidity, 2)" />

		<!-- Pressure card -->
		<SingleMeasurementCard title="Pressure"
			:value="props.lastMeasurement?.pressure"
			unit="hPa"
			icon="fa-solid fa-gauge-high"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.pressure, 2)" />
		
		<!-- Gas card -->
		<SingleMeasurementCard title="Gas"
			:value="props.lastMeasurement?.gas"
			unit="kOhm"
			icon="fa-solid fa-smog"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.gas, 2)" />

		<!-- PM1 card -->
		<SingleMeasurementCard title="PM1"
			:value="props.lastMeasurement?.pm1"
			unit="µg/m³"
			icon="fa-solid fa-hill-rockslide"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.pm1, 2)" />

		<!-- PM2.5 card -->
		<SingleMeasurementCard title="PM2.5"
			:value="props.lastMeasurement?.pm25"
			unit="µg/m³"
			icon="fa-solid fa-hill-rockslide"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.pm25, 2)" />

		<!-- PM10 card -->
		<SingleMeasurementCard title="PM10"
			:value="props.lastMeasurement?.pm10"
			unit="µg/m³"
			icon="fa-solid fa-hill-rockslide"
			:percentageDifference="limitDecimalNumbers(props.lastMeasurement.percentages?.pm10, 2)" />
	</div>
</template>