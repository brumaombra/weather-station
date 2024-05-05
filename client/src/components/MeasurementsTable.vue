<script setup>
import GlobalStore from '@/stores/global.js';
import MeasurementsStore from '@/stores/measurements.js';
import { setBusy, showToast, deleteMeasurements, updateMeasurement, getMeasurements, getMaxAndMinFromDate } from '@/utils/utils.js';
import { formatDecimal, formatTimestamp, formatJsDateToIsoStringDate } from '@/utils/formatter.js';

// View model
const viewModel = MeasurementsStore;

// Load the measurements
const loadMeasurements = async loadNewPage => {
    setBusy(true); // Busy on
    let params = { // Query parameters
        orderField: viewModel.orderBy || 'timestamp',
        orderDirection: viewModel.orderDirection || 'desc',
        limit: 25 // Default to 25
    };
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    if (loadNewPage) params.offset = GlobalStore.measurementsList?.results?.length || 0; // Add offset for pagination
    try { // Try to get the measurements
        const results = await getMeasurements(params); // Get the measurements
        if (loadNewPage) // If pagination
            GlobalStore.measurementsList.results = [...GlobalStore.measurementsList.results, ...results.results]; // Concatenate the new data
        else
            GlobalStore.measurementsList = results; // Update the data
        handleTableSelectionChange(); // Check if selected
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while loading the measurements', { cause: error }); // Save the old error to the stack
        showToast(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// The filter dialog button "apply"
const handleApplyFilterPress = () => {
    viewModel.orderBy = viewModel.dialogFilter.orderBy; // Apply order by
    viewModel.orderDirection = viewModel.dialogFilter.orderDirection; // Apply order direction
    const startDate = getMaxAndMinFromDate(viewModel.dialogFilter.startDate).minDate; // Get the date at 00:00
    const endDate = getMaxAndMinFromDate(viewModel.dialogFilter.endDate).maxDate; // Get the date at 23:59
    if (startDate) viewModel.startDate = formatJsDateToIsoStringDate(startDate, true); // Apply start date
    if (endDate) viewModel.endDate = formatJsDateToIsoStringDate(endDate, true); // Apply end date
    loadMeasurements(); // Load measurements
};

// Select all table items
const handleSelectDeselectAllPress = () => {
    viewModel.selectedAll = !viewModel.selectedAll; // Change true/false
    GlobalStore.measurementsList.results.forEach(item => item.selected = viewModel.selectedAll);
    handleTableSelectionChange(); // Check if selected
};

// Table selection change event
const handleTableSelectionChange = () => {
    const selectedElements = GlobalStore.measurementsList.results.filter(item => item.selected); // Get the selected items
    viewModel.selectedElements = selectedElements; // If items selected, display mass delete button
};

// Open a dialog
const saveItemReference = measurement => {
    if (measurement) Object.assign(viewModel.tempMeasurement, { ...measurement }); // Save the element
};

// Edit the measurement
const handleSaveEditPress = async () => {
    setBusy(true); // Busy on
    const newData = { ...viewModel.tempMeasurement }; // Clone and clean object
    delete newData.timestamp; // Remove timestamp
    delete newData.selected; // Remove selected flag
    try { // Try to get the measurements
        const result = await updateMeasurement(newData); // Update the data
        loadMeasurements(); // Load the measurements
        showToast('Changes successfully saved!', 'success'); // Show toast
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while saving the changes', { cause: error }); // Save the old error to the stack
        showToast(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Delete the measurement
const handleDeleteItemPress = async () => {
    try {
        setBusy(true); // Busy on
        const results = await deleteMeasurements([viewModel.tempMeasurement.id]);
        loadMeasurements(); // Load the measurements
        showToast('Measurement deleted successfully!', 'success'); // Show toast
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while deleting the measurement', { cause: error }); // Save the old error to the stack
        showToast(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Reset button pressed
const handleResetIconPress = () => {
    loadMeasurements(); // Load the measurements
};

// Delete selected button pressed
const handleMassDeletePress = async () => {
    try {
        setBusy(true); // Busy on
        const selectedIds = GlobalStore.measurementsList.results.filter(item => item.selected).map(item => item.id); // Get the selected IDs
        const results = await deleteMeasurements(selectedIds); // Call mass delete
        loadMeasurements(); // Load the measurements
        showToast(`${results} measurements deleted successfully!`, 'success'); // Show toast
        setBusy(false); // Busy off
    } catch(error) {
        setBusy(false); // Busy off
        const newError = new Error('Error while deleting the measurements', { cause: error }); // Save the old error to the stack
        showToast(newError.message, 'error'); // Show toast
        throw newError; // Throw the error
    }
};

// Load more button pressed
const handleLoadMorePress = () => {
    loadMeasurements(true); // Load more measurements
};

// Init function
const init = () => {
    if (viewModel.initTableDone) return; // If already done, exit
    viewModel.initTableDone = true; // Mark as executed
    loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Toolbar -->
    <div class="mb-4">
        <div class="row">
            <div class="col-md-6 col-12">
                <!-- Title -->
                <div class="d-flex align-items-center justify-content-between h-100">
                    <h3 class="mb-0"><i class="fa-solid fa-table me-3"></i>Measurements<span class="badge text-bg-secondary rounded-3 ms-3">{{ GlobalStore.measurementsList.count }}</span></h3>
                </div>
            </div>
            <div class="col-md-6 col-12 mt-md-0 mt-3">
                <!-- Actions desktop -->
                <div class="d-none d-md-block">
                    <div class="d-flex align-items-center justify-content-end">
                        <!-- Buttons -->
                        <button type="button" class="btn btn-danger me-2 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#confirmMassDeleteModal" v-if="viewModel.selectedElements.length > 0">
                            <i class="fa-regular fa-trash-can fs-5 me-2"></i>DELETE {{ viewModel.selectedElements.length }} ITEMS
                        </button>
                        <button type="button" class="btn btn-secondary me-2 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#filterModal">
                            <i class="fa-solid fa-filter fs-5 me-2"></i>FILTER
                        </button>
                        <button type="button" class="btn btn-secondary d-flex justify-content-center align-items-center" @click="handleResetIconPress()">
                            <i class="fa-solid fa-arrows-rotate fs-5 me-2"></i>REFRESH
                        </button>
                    </div>
                </div>

                <!-- Actions mobile -->
                <div class="d-block d-md-none">
                    <!-- Buttons -->
                    <div class="row align-items-center">
                        <div class="col-12">
                            <button type="button" class="btn btn-danger w-100 d-flex justify-content-center align-items-center mb-2" data-bs-toggle="modal" data-bs-target="#confirmMassDeleteModal" v-if="viewModel.selectedElements.length > 0">
                                <i class="fa-regular fa-trash-can fs-5 me-2"></i>DELETE {{ viewModel.selectedElements.length }} ITEMS
                            </button>
                        </div>
                        <div class="col-6">
                            <button type="button" class="btn btn-secondary w-100 d-flex justify-content-center align-items-center" data-bs-toggle="modal" data-bs-target="#filterModal">
                                <i class="fa-solid fa-filter fs-5 me-2"></i>FILTER
                            </button>
                        </div>
                        <div class="col-6">
                            <button type="button" class="btn btn-secondary w-100 d-flex justify-content-center align-items-center" @click="handleResetIconPress()">
                                <i class="fa-solid fa-arrows-rotate fs-5 me-2"></i>REFRESH
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Table -->
    <div class="table-responsive mb-4">
        <table class="table table-striped table-bordered">
            <thead class="text-center">
                <tr>
                    <th v-if="GlobalStore.adminToken"><input class="form-check-input table-checkbox cursor-pointer" type="checkbox" @change="handleSelectDeselectAllPress()" /></th>
                    <th>ID</th>
                    <th>Timestamp</th>
                    <th>Temperature</th>
                    <th>Humidity</th>
                    <th>Pressure</th>
                    <th>Gas</th>
                    <th>PM2.5</th>
                    <th>PM10</th>
                    <th v-if="GlobalStore.adminToken"></th>
                    <th v-if="GlobalStore.adminToken"></th>
                </tr>
            </thead>
            <tbody class="text-center">
                <tr v-for="item in GlobalStore.measurementsList.results">
                    <td class="column-selection" v-if="GlobalStore.adminToken"><input class="form-check-input table-checkbox cursor-pointer" type="checkbox" v-model="item.selected" @change="handleTableSelectionChange()" /></td>
                    <th class="column-id">{{ item.id }}</th>
                    <td class="column-timestamp">{{ formatTimestamp(item.timestamp) }}</td>
                    <td class="column-measurements">{{ formatDecimal(item.temperature, 1) }} <span class="measurementUnit">°C</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.humidity, 1) }} <span class="measurementUnit">%</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pressure, 0) }} <span class="measurementUnit">hPa</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.gas, 0) }} <span class="measurementUnit">ppm</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pm25, 0) }} <span class="measurementUnit">µg/m³</span></td>
                    <td class="column-measurements">{{ formatDecimal(item.pm10, 0) }} <span class="measurementUnit">µg/m³</span></td>
                    <td class="column-icon" v-if="GlobalStore.adminToken"><i class="fa-regular fa-pen-to-square text-secondary fs-5 cursor-pointer" data-bs-toggle="modal" data-bs-target="#editModal" @click="saveItemReference(item)"></i></td>
                    <td class="column-icon" v-if="GlobalStore.adminToken"><i class="fa-regular fa-trash-can text-danger fs-5 cursor-pointer" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" @click="saveItemReference(item)"></i></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <div class="d-flex mb-4 justify-content-center">
        <button type="button" class="btn btn-secondary d-flex justify-content-center align-items-center" @click="handleLoadMorePress()" v-if="GlobalStore.measurementsList.results.length < GlobalStore.measurementsList.count">
            <i class="fa-solid fa-angles-down fs-5 cursor-pointer me-2"></i>LOAD MORE
        </button>
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

                    <!-- Order by -->
                    <div class="mb-3">
                        <label class="form-label">Order by</label>
                        <select class="form-select" v-model="viewModel.dialogFilter.orderBy">
                            <option value="timestamp">Timestamp</option>
                            <option value="temperature">Temperature</option>
                            <option value="humidity">Humidity</option>
                            <option value="pressure">Pressure</option>
                            <option value="gas">Gas</option>
                            <option value="pm25">PM2.5</option>
                            <option value="pm10">PM10</option>
                        </select>
                        <div class="form-text">On which field to apply the filter</div>
                    </div>

                    <!-- Order direction -->
                    <div class="mb-3">
                        <label class="form-label">Direction</label>
                        <select class="form-select" v-model="viewModel.dialogFilter.orderDirection">
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                        <div class="form-text">The direction of the filter</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleApplyFilterPress()">APPLY</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirm mass delete modal -->
    <div id="confirmMassDeleteModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><i class="fa-solid fa-circle-question me-2"></i>Confirm</h1>
                </div>
                <div class="modal-body">
                    <p class="mb-0">Delete the selected measurements?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="handleMassDeletePress()">DELETE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirm delete modal -->
    <div id="confirmDeleteModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><i class="fa-solid fa-circle-question me-2"></i>Confirm</h1>
                </div>
                <div class="modal-body">
                    <p class="mb-0">Delete the measurement?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="handleDeleteItemPress()">DELETE</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit modal -->
    <div id="editModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><i class="fa-solid fa-pen-to-square me-2"></i>Edit</h1>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Timestamp</label>
                        <p>{{ formatTimestamp(viewModel.tempMeasurement.timestamp) }}</p>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Temperature</label>
                        <input type="number" v-model="viewModel.tempMeasurement.temperature" class="form-control" placeholder="Temperature" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Humidity</label>
                        <input type="number" v-model="viewModel.tempMeasurement.humidity" class="form-control" placeholder="Humidity" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Pressure</label>
                        <input type="number" v-model="viewModel.tempMeasurement.pressure" class="form-control" placeholder="Pressure" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Gas</label>
                        <input type="number" v-model="viewModel.tempMeasurement.gas" class="form-control" placeholder="Gas" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">PM2.5</label>
                        <input type="number" v-model="viewModel.tempMeasurement.pm25" class="form-control" placeholder="PM2.5" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">PM10</label>
                        <input type="number" v-model="viewModel.tempMeasurement.pm10" class="form-control" placeholder="PM10" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">CANCEL</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="handleSaveEditPress()">SAVE</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    /* Table column classes */
    .column-id {
        width: 100px;
        min-width: 70px;
    }
    .column-icon {
        width: 60px;
        min-width: 50px;
    }
    .column-selection {
        width: 60px;
        min-width: 50px;
    }
    .column-timestamp {
        min-width: 180px;
    }
    .column-measurements {
        width: 130px;
        min-width: 130px;
        font-weight: 600;
    }
    .measurementUnit {
        font-size: 14px;
        font-weight: 400;
    }
</style>