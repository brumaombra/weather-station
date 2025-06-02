<script setup>
import MeasurementsTable from '~/components/measurements/MeasurementsTable.vue';
import SectionTitle from '~/components/ui/SectionTitle.vue';
import PageHeader from '~/components/ui/PageHeader.vue';
</script>

<template>
	<NuxtLayout name="dashboard">
		<div class="space-y-8">
			<!-- Header -->
			<PageHeader title="Measurements" icon="fa-solid fa-table-list" />

			<!-- Table section -->
			<div>
				<SectionTitle title="Measurements Table" />
				<MeasurementsTable />
			</div>
		</div>
	</NuxtLayout>
</template>