<script setup>
import Navbar from '@/components/Navbar.vue';
import MeasurementsTable from '@/components/MeasurementsTable.vue';
import Busy from '@/components/Busy.vue'
import GlobalStore from '@/stores/store';
import { getMeasurements, setBusy } from '@/utils/utils.js';

// Load the measurements
setBusy(true); // Busy on
getMeasurements(data => {
	GlobalStore.measurementsList = data; // Save the loaded measurements
	setBusy(false); // Busy off
}, error => {
	setBusy(false); // Busy off
});
</script>

<template>
	<!-- Navbar -->
	<Navbar />

	<!-- Main container -->
	<div class="container mt-5">
		<!-- Table -->
		<MeasurementsTable />
	</div>

	<!-- Busy -->
	<Busy />
</template>