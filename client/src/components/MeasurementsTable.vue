<script setup>
import { reactive } from 'vue';
import GlobalStore from '@/stores/store';
import { setBusy, showToast, deleteMeasurements, updateMeasurement, getMeasurements } from '@/utils/utils.js';
import { formatHumidity, formatTemperature, formatTimestamp } from '@/utils/formatter.js';

// View model
const viewModel = reactive({
    tempMeasurement: {}, // Item temp value
    buttonMassDeleteVisible: false, // Mass delete button
    selectedAll: false, // Select all checkbox value
    orderBy: 'timestamp', // The order field
    orderDirection: 'desc', // The order direction
    dialogSort: { // Filter dialog properties
        orderBy: 'timestamp', // The order field
        orderDirection: 'desc' // The order direction
    }
});

// Load the measurements
const loadMeasurements = (successCallback, errorCallback, loadNewPage) => {
    setBusy(true); // Busy on
    let params = { // Query parameters
        orderField: viewModel.orderBy || 'timestamp',
        orderDirection: viewModel.orderDirection || 'desc'
    };
	if (loadNewPage) params.lastDocumentId = GlobalStore.measurementsList[GlobalStore.measurementsList.length - 1]?.id; // Add last item for pagination

    // Get the measurements
    getMeasurements(results => {
        if (loadNewPage) // If pagination
            GlobalStore.measurementsList = [ ...GlobalStore.measurementsList, ...results]; // Concatenate the new data
        else
            GlobalStore.measurementsList = results; // Update the data
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
    viewModel.orderBy = viewModel.dialogSort.orderBy; // Apply order by
    viewModel.orderDirection = viewModel.dialogSort.orderDirection; // Apply order direction
    loadMeasurements(); // Load measurements
};

// Select all table items
const handleSelectDeselectAllPress = () => {
    viewModel.selectedAll = !viewModel.selectedAll; // Change true/false
    GlobalStore.measurementsList.forEach(item => item.selected = viewModel.selectedAll);
    handleTableSelectionChange(); // Check if selected
};

// Table selection change event
const handleTableSelectionChange = () => {
    const selectedIds = GlobalStore.measurementsList.filter(item => item.selected); // Get the selected items
    viewModel.buttonMassDeleteVisible = selectedIds.length > 0; // If items selected, display mass delete button
};

// Open a dialog
const openDialog = (dialog, measurement) => {
    if (measurement) Object.assign(viewModel.tempMeasurement, { ...measurement }); // Save the element
    const modalDom = document.getElementById(dialog);
    const modal = new bootstrap.Modal(modalDom);
    modal.show();
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
    deleteMeasurements([ viewModel.tempMeasurement.id ], response => { // Delete the measurement from the DB
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
    const selectedIds = GlobalStore.measurementsList.filter(item => item.selected).map(item => item.id); // Get the selected IDs
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
	if (GlobalStore.measurementsList.length > 0) return; // If already done, exit
	loadMeasurements(); // Load the measurements
};

init(); // Call init function
</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex mb-4 align-items-center justify-content-between">
        <!-- Title -->
        <div>
            <h3 class="mb-0"><i class="fa-solid fa-table me-3"></i>Measurements<span class="badge text-bg-secondary rounded-3 ms-3">{{ GlobalStore.measurementsList.length }}</span></h3>
        </div>
        
        <!-- Buttons -->
        <div>
            <button type="button" class="btn btn-danger me-2" @click="openDialog('confirmMassDeleteModal')" v-if="viewModel.buttonMassDeleteVisible"><i class="fa-regular fa-trash-can fs-5 me-2"></i>DELETE SELECTED</button>
            <button type="button" class="btn btn-secondary me-2" @click="openDialog('sortModal')"><i class="fa-solid fa-arrow-down-a-z fs-5 me-2"></i>SORT</button>
            <button type="button" class="btn btn-secondary" @click="handleResetIconPress()"><i class="fa-solid fa-arrows-rotate fs-5 me-2"></i>REFRESH</button>
        </div>
    </div>

    <!-- Table -->
    <table class="table table-striped mb-4">
        <thead class="text-center">
            <tr>
                <th><input class="form-check-input table-checkbox cursor-pointer" type="checkbox" @change="handleSelectDeselectAllPress()" /></th>
                <th>ID</th>
                <th>Timestamp</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th></th>
            </tr>
        </thead>
        <tbody class="text-center">
            <tr v-for="item in GlobalStore.measurementsList">
                <td><input class="form-check-input table-checkbox cursor-pointer" type="checkbox" v-model="item.selected" @change="handleTableSelectionChange()" /></td>
                <th class="column-id">{{ item.id }}</th>
                <td>{{ formatTimestamp(item.timestamp) }}</td>
                <td>{{ formatTemperature(item.temperature) }} °C</td>
                <td>{{ formatHumidity(item.humidity) }} %</td>
                <td class="column-icons">
                    <i class="fa-regular fa-pen-to-square text-secondary fs-5 cursor-pointer" @click="openDialog('editModal', item)"></i>
                    <i class="fa-regular fa-trash-can text-danger fs-5 cursor-pointer ms-4" @click="openDialog('confirmDeleteModal', item)"></i>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Pagination -->
    <div class="d-flex mb-4 justify-content-center">
        <button type="button" class="btn btn-secondary" @click="handleLoadMorePress()"><i class="fa-solid fa-angles-down fs-5 cursor-pointer me-2"></i>LOAD MORE</button>
    </div>

    <!-- Sort modal -->
    <div id="sortModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5"><i class="fa-solid fa-arrow-down-a-z me-2"></i>Sort</h1>
                </div>
                <div class="modal-body">
                    <!-- Order by -->
                    <div class="mb-3">
                        <label class="form-label">Order by</label>
                        <select class="form-select" v-model="viewModel.dialogSort.orderBy">
                            <option value="timestamp">Timestamp</option>
                            <option value="temperature">Temperature</option>
                            <option value="humidity">Humidity</option>
                        </select>
                        <div class="form-text">On which field to apply the filter</div>
                    </div>

                    <!-- Order direction -->
                    <div class="mb-3">
                        <label class="form-label">Direction</label>
                        <select class="form-select" v-model="viewModel.dialogSort.orderDirection">
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