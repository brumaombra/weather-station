<script setup>
import MeasurementsTable from '@/components/MeasurementsTable.vue';
import GlobalStore from '@/stores/store';
import { getMeasurements, setBusy } from '@/utils/utils.js';

// Load the measurements
const loadMeasurements = () => {
	setBusy(true); // Busy on
	getMeasurements(data => {
		GlobalStore.measurementsList = data; // Save the loaded measurements
		setBusy(false); // Busy off
	}, error => {
		setBusy(false); // Busy off
	});
};

// Init function
const init = () => {
	if (GlobalStore.measurementsList.length > 0) return; // If already done, exit
	loadMeasurements(); // Load the measurements
};

init(); // Call init function

</script>

<template>
	<!-- Table -->
	<MeasurementsTable />
</template>