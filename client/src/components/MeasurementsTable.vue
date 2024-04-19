<script setup>
import { reactive } from 'vue';
import GlobalStore from '@/stores/store.js';
import { setBusy, showToast, deleteMeasurements, updateMeasurement, getMeasurements } from '@/utils/utils.js';
import { formatHumidity, formatTemperature, formatTimestamp } from '@/utils/formatter.js';

// View model
const viewModel = reactive({
    tempMeasurement: {}, // Item temp value
    buttonMassDeleteVisible: false, // Mass delete button
    selectedAll: false, // Select all checkbox value
    orderBy: 'timestamp', // The order field
    orderDirection: 'desc', // The order direction
    startDate: '', // Start date
    endDate: '', // End date
    dialogFilter: { // Filter dialog properties
        orderBy: 'timestamp', // The order field
        orderDirection: 'desc', // The order direction
        startDate: '', // Start date
        endDate: '' // End date
    }
});

// Load the measurements
const loadMeasurements = (successCallback, errorCallback, loadNewPage) => {
    setBusy(true); // Busy on
    let params = { // Query parameters
        orderField: viewModel.orderBy || 'timestamp',
        orderDirection: viewModel.orderDirection || 'desc',
        limit: 25 // Default to 25
    };
    if (viewModel.startDate) params.startDate = viewModel.startDate; // Add start date filter
    if (viewModel.endDate) params.endDate = viewModel.endDate; // Add end date filter
    if (loadNewPage) params.offset = GlobalStore.measurementsList.results.length; // Add offset for pagination

    // Get the measurements
    getMeasurements(response => {
        if (loadNewPage) // If pagination
            GlobalStore.measurementsList.results = [...GlobalStore.measurementsList.results, ...response.results]; // Concatenate the new data
        else
            GlobalStore.measurementsList = response; // Update the data
        handleTableSelectionChange(); // Check if selected
        setBusy(false); // Busy off
        if (successCallback) successCallback(); // Success callback
    }, error => {
        setBusy(false); // Busy off
        if (errorCallback) errorCallback(); // Error callback
        showToast('Error while loading the measurements', 'error'); // Show toast
    }, params);
};

// The filter dialog button "apply"
const handleApplyFilterPress = () => {
    viewModel.orderBy = viewModel.dialogFilter.orderBy; // Apply order by
    viewModel.orderDirection = viewModel.dialogFilter.orderDirection; // Apply order direction
    viewModel.startDate = viewModel.dialogFilter.startDate; // Apply start date
    viewModel.endDate = viewModel.dialogFilter.endDate; // Apply end date
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
    const selectedIds = GlobalStore.measurementsList.results.filter(item => item.selected); // Get the selected items
    viewModel.buttonMassDeleteVisible = selectedIds.length > 0; // If items selected, display mass delete button
};

// Open a dialog
const saveItemReference = measurement => {
    if (measurement) Object.assign(viewModel.tempMeasurement, { ...measurement }); // Save the element
};

// Edit the measurement
const handleSaveEditPress = () => {
    setBusy(true); // Busy on
    const newData = { ...viewModel.tempMeasurement }; // Clone and clean object
    delete newData.timestamp; // Remove timestamp
    delete newData.selected; // Remove selected flag
    updateMeasurement(newData, response => { // Update the measurement on the DB
        loadMeasurements(); // Load the measurements
        showToast('Changes successfully saved!', 'success'); // Show toast
    }, error => {
        setBusy(false); // Busy off
        showToast('Error while saving the changes', 'error'); // Show toast
    });
};

// Delete the measurement
const handleDeleteItemPress = () => {
    setBusy(true); // Busy on
    deleteMeasurements([viewModel.tempMeasurement.id], response => { // Delete the measurement from the DB
        loadMeasurements(); // Load the measurements
        showToast('Measurement deleted successfully!', 'success'); // Show toast
    }, error => {
        showToast('Error while deleting the measurement', 'error'); // Show toast
        setBusy(false); // Busy off
    });
};

// Reset button pressed
const handleResetIconPress = () => {
    loadMeasurements(); // Load the measurements
};

// Delete selected button pressed
const handleMassDeletePress = () => {
    setBusy(true); // Busy on
    const selectedIds = GlobalStore.measurementsList.results.filter(item => item.selected).map(item => item.id); // Get the selected IDs
    deleteMeasurements(selectedIds, response => { // Delete the measurement from the DB
        loadMeasurements(); // Load the measurements
        showToast('Measurements deleted successfully!', 'success'); // Show toast
    }, error => {
        setBusy(false); // Busy off
        showToast('Error while deleting the measurements', 'error'); // Show toast
    });
};

// Load more button pressed
const handleLoadMorePress = () => {
    loadMeasurements(null, null, true); // Load more measurements
};

// Init function
const init = () => {
    if (GlobalStore.measurementsList.results.length > 0) return; // If already done, exit
    loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex align-items-center justify-content-between mb-4">
        <!-- Title -->
        <div>
            <h3 class="mb-0"><i class="fa-solid fa-table me-3"></i>Measurements<span class="badge text-bg-secondary rounded-3 ms-3">{{ GlobalStore.measurementsList.count }}</span></h3>
        </div>

        <!-- Buttons -->
        <div>
            <button type="button" class="btn btn-danger me-2" data-bs-toggle="modal" data-bs-target="#confirmMassDeleteModal" v-if="viewModel.buttonMassDeleteVisible"><i class="fa-regular fa-trash-can fs-5 me-2"></i>DELETE SELECTED</button>
            <button type="button" class="btn btn-secondary me-2" data-bs-toggle="modal" data-bs-target="#filterModal"><i class="fa-solid fa-filter fs-5 me-2"></i>FILTER</button>
            <button type="button" class="btn btn-secondary" @click="handleResetIconPress()"><i class="fa-solid fa-arrows-rotate fs-5 me-2"></i>REFRESH</button>
        </div>
    </div>

    <!-- Table -->
    <table class="table table-striped mb-4">
        <thead class="text-center">
            <tr>
                <th v-if="GlobalStore.adminToken"><input class="form-check-input table-checkbox cursor-pointer" type="checkbox" @change="handleSelectDeselectAllPress()" /></th>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th v-if="GlobalStore.adminToken"></th>
            </tr>
        </thead>
        <tbody class="text-center">
            <tr v-for="item in GlobalStore.measurementsList.results">
                <td v-if="GlobalStore.adminToken"><input class="form-check-input table-checkbox cursor-pointer" type="checkbox" v-model="item.selected" @change="handleTableSelectionChange()" /></td>
                <th class="column-id">{{ item.id }}</th>
                <td>{{ formatTimestamp(item.timestamp) }}</td>
                <td>{{ formatTemperature(item.temperature) }} °C</td>
                <td>{{ formatHumidity(item.humidity) }} %</td>
                <td class="column-icons" v-if="GlobalStore.adminToken">
                    <i class="fa-regular fa-pen-to-square text-secondary fs-5 cursor-pointer" data-bs-toggle="modal" data-bs-target="#editModal" @click="saveItemReference(item)"></i>
                    <i class="fa-regular fa-trash-can text-danger fs-5 cursor-pointer ms-4" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal" @click="saveItemReference(item)"></i>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Pagination -->
    <div class="d-flex mb-4 justify-content-center">
        <button type="button" class="btn btn-secondary" @click="handleLoadMorePress()" v-if="GlobalStore.measurementsList.results.length < GlobalStore.measurementsList.count"><i class="fa-solid fa-angles-down fs-5 cursor-pointer me-2"></i>LOAD MORE</button>
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
                    <!-- Timestamp -->
                    <div class="mb-3">
                        <label class="form-label">Timestamp</label>
                        <p>{{ formatTimestamp(viewModel.tempMeasurement.timestamp) }}</p>
                    </div>

                    <!-- Temperature -->
                    <div class="mb-3">
                        <label class="form-label">Temperature</label>
                        <input type="number" v-model="viewModel.tempMeasurement.temperature" class="form-control" placeholder="Temperature" />
                    </div>

                    <!-- Humidity -->
                    <div class="mb-3">
                        <label class="form-label">Humidity</label>
                        <input type="number" v-model="viewModel.tempMeasurement.humidity" class="form-control" placeholder="Humidity" />
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
    max-width: 120px;
}
.column-icons {
    max-width: 60px;
}
</style>