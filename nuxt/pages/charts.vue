<script setup>
import { onMounted, ref } from 'vue';
import { useChartsStore } from '~/composables/stores/useChartsStore.js';
import LineChartCard from '~/components/charts/LineChartCard.vue';
import CurrentDataCards from '~/components/charts/CurrentDataCards.vue';
import FilterModal from '~/components/FilterModal.vue';
import { setBusy, showMessageDialog, getMaxAndMinFromDate } from '~/composables/useUtils.js';
import { getAggregatedMeasurements, getLastMeasurement } from '~/composables/api/useMeasurements.js';
import { formatJsDateToIsoStringDate } from '~/utils/formatter.js';
import Button from '~/components/ui/Button.vue';
import Select from '~/components/ui/Select.vue';
import SectionTitle from '~/components/ui/SectionTitle.vue';
import PageHeader from '~/components/ui/PageHeader.vue';

// View model
const viewModel = useChartsStore(); // Use the store
const filterModalOpen = ref(false);

// Load the measurements
const loadMeasurements = async () => {
    const params = {};
    if (viewModel.value.startDate) params.startDate = viewModel.value.startDate; // Add start date filter
    if (viewModel.value.endDate) params.endDate = viewModel.value.endDate; // Add end date filter

    try {
        setBusy(true); // Busy on
        const results = await getAggregatedMeasurements(params); // Get the aggregated measurements
        viewModel.value.aggregatedMeasurementsList = results; // Save the loaded measurements
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    } finally {
        setBusy(false); // Busy off
    }
};

// Load the last measurement
const loadLastMeasurement = async () => {
    try {
        const result = await getLastMeasurement(); // Get the last measurement
        viewModel.value.lastMeasurement = result; // Save the measurement
    } catch (error) {
        const newError = new Error('Error while reading the last measurement', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Add the filter dates from the selected period
const addFilterDatesFromPeriod = () => {
    let days = 1; // Number of days to filter
    switch (viewModel.value.periodSelect) {
        case 'D':
            days = 1;
            break;
        case 'W':
            days = 7;
            break;
        case 'M':
            days = 30;
            break;
        case 'Y':
            days = 365;
            break;
    }

    // Create the start and end dates
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days); // Tot days ago
    const startDate = days === 1 ? pastDate : getMaxAndMinFromDate(pastDate).minDate; // Get the date at 00:00
    viewModel.value.startDate = formatJsDateToIsoStringDate(startDate, true); // Set formatted start date (If 1 day include time)
};

// When period select changed
const handlePeriodChange = event => {
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

// Open filter modal button pressed
const handleOpenFilterModalPress = () => {
    filterModalOpen.value = true; // Open the modal
};

// Handle filter dialog button "apply"
const handleApplyFilterPress = filters => {
    viewModel.value.dialogFilter = filters; // Save the filters
    const startDate = getMaxAndMinFromDate(viewModel.value.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.value.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.value.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.value.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    loadMeasurements(); // Load measurements
};

// Init function
const init = async () => {
    if (viewModel.value.initDone) return; // If already done, exit
    viewModel.value.initDone = true; // Mark as executed

    try {
        setBusy(true); // Busy on
        addFilterDatesFromPeriod() // Add the filter dates from the selected period
        await Promise.all([ // Execute in parallel
            loadMeasurements(),
            loadLastMeasurement() // Load the last measurement
        ]);
    } catch (error) {
        showMessageDialog(error.message, 'error'); // Show error dialog
        console.error('Error loading measurements:', error);
    } finally {
        setBusy(false); // Busy off
    }
};

// On component mounted
onMounted(async () => {
    await init();
});
</script>

<template>
    <NuxtLayout name="dashboard">
        <div class="space-y-8">
            <!-- Header -->
            <PageHeader title="Charts" icon="fa-solid fa-chart-line">
                <template #actions>
                    <div class="flex items-center gap-2">
                        <!-- Filter button -->
                        <Button type="primary" text="Filter" icon="fa-solid fa-filter" @click="handleOpenFilterModalPress" />

                        <!-- Periods select -->
                        <Select v-model="viewModel.periodSelect" @change="handlePeriodChange">
                            <option value="D">Last day</option>
                            <option value="W">Last week</option>
                            <option value="M">Last month</option>
                            <option value="Y">Last year</option>
                        </Select>
                    </div>
                </template>
            </PageHeader>

            <!-- Real-time data cards -->
            <div>
                <SectionTitle title="Real-time data" />
                <CurrentDataCards :lastMeasurement="viewModel.lastMeasurement" />
            </div>

            <!-- Charts -->
            <div>
                <SectionTitle title="Charts" />
                <div class="grid lg:grid-cols-2 gap-4 sm:gap-6">
                    <!-- Temperature chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="Temperature"
                        avgKey="temperatureAvg"
                        maxKey="temperatureMax"
                        minKey="temperatureMin" />

                    <!-- Humidity chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="Humidity"
                        avgKey="humidityAvg"
                        maxKey="humidityMax"
                        minKey="humidityMin" />

                    <!-- Pressure chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="Pressure"
                        avgKey="pressureAvg"
                        maxKey="pressureMax"
                        minKey="pressureMin" />

                    <!-- Gas chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="Gas"
                        avgKey="gasAvg"
                        maxKey="gasMax"
                        minKey="gasMin" />

                    <!-- PM1 chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="PM1"
                        avgKey="pm1Avg"
                        maxKey="pm1Max"
                        minKey="pm1Min" />

                    <!-- PM2.5 chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="PM2.5"
                        avgKey="pm25Avg"
                        maxKey="pm25Max"
                        minKey="pm25Min" />

                    <!-- PM10 chart -->
                    <LineChartCard :measurementsList="viewModel.aggregatedMeasurementsList?.results"
                        title="PM10"
                        avgKey="pm10Avg"
                        maxKey="pm10Max"
                        minKey="pm10Min" />
                </div>
            </div>
        </div>

        <!-- Filter modal -->
        <FilterModal :visible="filterModalOpen"
            :filters="viewModel.filters"
            @apply="handleApplyFilterPress"
            @update:visible="filterModalOpen = $event"
            :startDateVisible="true"
            :endDateVisible="true" />
    </NuxtLayout>
</template>