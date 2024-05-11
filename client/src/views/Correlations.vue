<script setup>
import TempHumScatterChart from '@/components/correlations/TempHumScatterChart.vue';
import Pm25Pm10ScatterChart from '@/components/correlations/Pm25Pm10ScatterChart.vue';
import PressGasScatterChart from '@/components/correlations/PressGasScatterChart.vue';
import TempGasScatterChart from '@/components/correlations/TempGasScatterChart.vue';
import TempPm1ScatterChart from '@/components/correlations/TempPm1ScatterChart.vue';
import HumPm1ScatterChart from '@/components/correlations/HumPm1ScatterChart.vue';
import CorrelationsStore from '@/stores/correlations.js';
import { getMeasurements, setBusy, showMessageDialog, getMaxAndMinFromDate } from '@/utils/utils.js';
import { formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = CorrelationsStore;

// Load the measurements
const loadMeasurements = async () => {
    setBusy(true); // Busy on
    const params = {};
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    try { // Try to get the data
        const results = await getMeasurements(params); // Get the aggregated measurements
        CorrelationsStore.measurementsList = results; // Save the loaded measurements
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        showMessageDialog(newError.message, 'error'); // Show toast
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
    if (viewModel.initDone) return; // If already done, exit
    viewModel.initDone = true; // Mark as executed
    addFilterDatesFromPeriod(); // Add the filter dates from the selected period
    loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Toolbar -->
    <div class="row">
        <div class="col-md-6 col-12">
            <!-- Title -->
            <div class="d-flex align-items-center justify-content-between h-100">
                <h3 class="mb-0"><i class="fa-solid fa-magnifying-glass-chart me-3"></i>Correlations</h3>
            </div>
        </div>
        <div class="col-md-6 col-12 mt-md-0 mt-3">
            <!-- Actions desktop -->
            <div class="d-none d-md-block">
                <div class="d-flex align-items-center justify-content-end">
                    <!-- Button filter modal -->
                    <button type="button" class="btn custom-grey-2-background me-2 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="fa-solid fa-filter fs-5 me-2"></i>FILTER</button>

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
                        <button type="button" class="btn custom-grey-2-background w-100 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="fa-solid fa-filter fs-5 me-2"></i>FILTER</button>
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

    <!-- Responsive grid -->
    <div class="mb-5">
        <div class="row">
            <!-- Temperature/humidity chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TempHumScatterChart />
            </div>

            <!-- PM2.5/PM10 chart -->
            <div class="col-lg-6 col-12 mt-5">
                <Pm25Pm10ScatterChart />
            </div>

            <!-- Pressure/Gas chart -->
            <div class="col-lg-6 col-12 mt-5">
                <PressGasScatterChart />
            </div>

            <!-- Temperature/Gas chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TempGasScatterChart />
            </div>

            <!-- Temperature/PM1 chart -->
            <div class="col-lg-6 col-12 mt-5">
                <TempPm1ScatterChart />
            </div>

            <!-- Humidity/PM1 chart -->
            <div class="col-lg-6 col-12 mt-5">
                <HumPm1ScatterChart />
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
                    <button type="button" class="btn custom-grey-2-background" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn custom-blue-background" data-bs-dismiss="modal" @click="handleApplyFilterPress()">APPLY</button>
                </div>
            </div>
        </div>
    </div>
</template>