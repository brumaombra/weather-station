<script setup>
import Navbar from './components/Navbar.vue';
import MeasurementsTable from './components/MeasurementsTable.vue';
import GlobalStore from '@/stores/store';
</script>

<template>
	<!-- Navbar -->
	<Navbar />

	<div class="container mt-5">
		<!-- Table -->
		<MeasurementsTable />
	</div>

</template>

<style scoped></style>