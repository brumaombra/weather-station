<script setup>
import { reactive } from 'vue';
import TemperatureLineChart from '@/components/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/HumidityLineChart.vue';
import GlobalStore from '@/stores/store.js';
import { getAggregatedMeasurements, setBusy, fromDaysToMilliseconds } from '@/utils/utils.js';
import { formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = reactive({
    periodSelect: 'W', // Selected period
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        startDate: '', // Start date
        endDate: '' // End date
    }
});

// Load the measurements
const loadMeasurements = () => {
    setBusy(true); // Busy on
    const params = {};
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter

    // Get the measurements
    getAggregatedMeasurements(data => {
        GlobalStore.measurementsListChart = data; // Save the loaded measurements
        setBusy(false); // Busy off
    }, error => {
        setBusy(false); // Busy off
    }, params);
};

// Add the filter dates from the selected period
const addFilterDatesFromPeriod = () => {
    let days = 1; // Number of days to filter
    switch (viewModel.periodSelect) {
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
    const start = new Date(new Date().getTime() - fromDaysToMilliseconds(days)); // Tot days ago
    viewModel.startDate = formatJsDateToIsoStringDate(start); // Set formatted start date
};

// When period select changed
const handlePeriodChange = event => {
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

// Handle filter dialog button "apply"
const handleApplyFilterPress = () => {
    viewModel.startDate = viewModel.dialogFilter.startDate; // Apply start date
    viewModel.endDate = viewModel.dialogFilter.endDate; // Apply end date
    loadMeasurements(); // Load measurements
};

// Init function
const init = () => {
    if (GlobalStore.measurementsListChart.length > 0) return; // If already done, exit
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

init(); // Call init function

</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex mb-4-5 align-items-center justify-content-between">
        <div>
            <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Charts</h3>
        </div>

        <div class="d-flex align-items-center justify-content-between">
            <!-- Button filter modal -->
            <button type="button" class="btn btn-secondary me-3" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="fa-solid fa-filter fs-5 me-2"></i>FILTER</button>

            <!-- Periods select -->
            <select class="form-select w-auto" v-model="viewModel.periodSelect" @change="handlePeriodChange">
                <option value="W">Last week</option>
                <option value="M">Last month</option>
                <option value="Y">Last year</option>
            </select>
        </div>
    </div>

    <!-- Container responsive -->
    <div class="row">
        <!-- Temperature chart -->
        <div class="col-6">
            <TemperatureLineChart />
        </div>

        <!-- Humidity chart -->
        <div class="col-6">
            <HumidityLineChart />
        </div>
    </div>

    <!-- Filter modal -->
    <div id="filterModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><i class="fa-solid fa-filter me-2"></i>Filter</h1>
                </div>
                <div class="modal-body">
                    <!-- Start date -->
                    <div class="mb-3">
                        <label class="form-label">Start date</label>
                        <input type="date" class="form-control" v-model="viewModel.dialogFilter.startDate" />
                        <div class="form-text">Extract data starting from this date</div>
                    </div>

                    <!-- End date -->
                    <div class="mb-3">
                        <label class="form-label">End date</label>
                        <input type="date" class="form-control" v-model="viewModel.dialogFilter.endDate" />
                        <div class="form-text">Extract data up to this date</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleApplyFilterPress()">APPLY</button>
                </div>
            </div>
        </div>
    </div>
</template>