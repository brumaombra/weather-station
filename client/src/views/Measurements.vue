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
	if (GlobalStore.firstMeasurementsViewInit) return; // If already done, exit
	GlobalStore.firstMeasurementsViewInit = true; // Mark as done
	loadMeasurements(); // Load the measurements
};

init(); // Call init function

</script>

<template>
	<!-- Table -->
	<MeasurementsTable />
</template>