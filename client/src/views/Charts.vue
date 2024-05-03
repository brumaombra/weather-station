<script setup>
import { reactive } from 'vue';
import TemperatureLineChart from '@/components/TemperatureLineChart.vue';
import HumidityLineChart from '@/components/HumidityLineChart.vue';
import PressureLineChart from '@/components/PressureLineChart.vue';
import GasLineChart from '@/components/GasLineChart.vue';
import GlobalStore from '@/stores/store.js';
import { getAggregatedMeasurements, setBusy, showToast, getMaxAndMinFromDate } from '@/utils/utils.js';
import { formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = reactive({
    periodSelect: 'D', // Selected period
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        startDate: '', // Start date
        endDate: '' // End date
    }
});

// Load the measurements
const loadMeasurements = async () => {
    setBusy(true); // Busy on
    const params = {};
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    try { // Try to get the data
        const results = await getAggregatedMeasurements(params); // Get the aggregated measurements
        GlobalStore.measurementsListChart = results; // Save the loaded measurements
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showToast(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
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
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days); // Tot days ago
    const startDate = days === 1 ? pastDate : getMaxAndMinFromDate(pastDate).minDate; // Get the date at 00:00
    viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Set formatted start date (If 1 day include time)
};

// When period select changed
const handlePeriodChange = event => {
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

// Handle filter dialog button "apply"
const handleApplyFilterPress = () => {
    const startDate = getMaxAndMinFromDate(viewModel.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    loadMeasurements(); // Load measurements
};

// Init function
const init = () => {
    if (GlobalStore.measurementsListChart.results.length > 0) return; // If already done, exit
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

init(); // Call init function

</script>

<template>
    <!-- Toolbar -->
    <div>
        <div class="row">
            <div class="col-md-6 col-12">
                <!-- Title -->
                <div class="d-flex align-items-center justify-content-between h-100">
                    <h3 class="mb-0"><i class="fa-solid fa-chart-line me-3"></i>Charts</h3>
                </div>
            </div>
            <div class="col-md-6 col-12 mt-md-0 mt-3">
                <!-- Actions desktop -->
                <div class="d-none d-md-block">
                    <div class="d-flex align-items-center justify-content-end">
                        <!-- Button filter modal -->
                        <button type="button" class="btn btn-secondary me-2 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="fa-solid fa-filter fs-5 me-2"></i>FILTER</button>

                        <!-- Periods select -->
                        <select class="form-select w-auto" v-model="viewModel.periodSelect" @change="handlePeriodChange()">
                            <option value="D">Last day</option>
                            <option value="W">Last week</option>
                            <option value="M">Last month</option>
                            <option value="Y">Last year</option>
                        </select>
                    </div>
                </div>

                <!-- Actions mobile -->
                <div class="d-block d-md-none">
                    <div class="row align-items-center">
                        <div class="col-6">
                            <!-- Button filter modal -->
                            <button type="button" class="btn btn-secondary w-100 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="fa-solid fa-filter fs-5 me-2"></i>FILTER</button>
                        </div>
                        <div class="col-6">
                            <!-- Periods select -->
                            <select class="form-select w-100" v-model="viewModel.periodSelect" @change="handlePeriodChange()">
                                <option value="D">Last day</option>
                                <option value="W">Last week</option>
                                <option value="M">Last month</option>
                                <option value="Y">Last year</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Responsive grid -->
    <div class="mb-4">
        <div class="row">
            <!-- Temperature chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TemperatureLineChart />
            </div>

            <!-- Humidity chart -->
            <div class="col-lg-6 col-12 mt-5">
                <HumidityLineChart />
            </div>

            <!-- Pressure chart -->
            <div class="col-lg-6 col-12 mt-5">
                <PressureLineChart />
            </div>

            <!-- Gas chart -->
            <div class="col-lg-6 col-12 mt-5">
                <GasLineChart />
            </div>
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