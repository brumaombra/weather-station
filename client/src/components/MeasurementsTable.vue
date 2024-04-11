<script setup>
import { reactive } from 'vue';
import GlobalStore from '@/stores/store';
import { setBusy, deleteMeasurement, updateMeasurement, getMeasurements } from '@/utils/utils.js';
import { timestampFormatter } from '@/utils/formatter.js';

let tempMeasurement = reactive({}); // Temp value

// Load the measurements
const loadMeasurements = () => {
    setBusy(true); // Busy on
    getMeasurements(results => {
        GlobalStore.measurementsList = results; // Update the data
        setBusy(false); // Busy off
    }, error => {
        setBusy(false); // Busy off
    });
}

// Open a dialog
const openDialog = (dialog, measurement) => {
    Object.assign(tempMeasurement, { ...measurement }); // Save the element
    const modalDom = document.getElementById(dialog);
    const modal = new bootstrap.Modal(modalDom);
    modal.show();
};

// Edit the measurement
const handleSaveEditPress = () => {
    setBusy(true); // Busy on
    const newData = { ...tempMeasurement }; // Clone and clean object
    updateMeasurement(newData, response => { // Update the measurement on the DB
        loadMeasurements(); // Load the measurements
    }, error => {
        setBusy(false); // Busy off
    });
};

// Delete the measurement
const handleDeleteItemPress = () => {
    setBusy(true); // Busy on
    deleteMeasurement(tempMeasurement.id, response => { // Delete the measurement from the DB
        loadMeasurements(); // Load the measurements
    }, error => {
        setBusy(false); // Busy off
    });
};

// Reset icon pressed
const handleResetIconPress = () => {
    loadMeasurements(); // Load the measurements
};
</script>

<template>
    <!-- Toolbar -->
    <div class="d-flex mb-4 align-items-center justify-content-between">
        <h3 class="mb-0"><i class="fa-solid fa-table me-3"></i>Measurements<span class="badge text-bg-secondary rounded-3 ms-3">{{ GlobalStore.measurementsList.length }}</span></h3>
        <button type="button" class="btn btn-secondary" @click="handleResetIconPress()"><i class="fa-solid fa-arrows-rotate fs-5 cursor-pointer me-2"></i>REFRESH</button>
    </div>

    <!-- Table -->
    <table class="table table-striped mb-4">
        <thead class="text-center">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Temperature</th>
                <th scope="col">Humidity</th>
                <th scope="col"></th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody class="text-center">
            <tr v-for="item in GlobalStore.measurementsList">
                <th scope="row">{{ item.id }}</th>
                <td>{{ timestampFormatter(item.timestamp) }}</td>
                <td>{{ item.temperature }} °C</td>
                <td>{{ item.humidity }} %</td>
                <td><i class="fa-regular fa-pen-to-square text-secondary fs-5 cursor-pointer" @click="openDialog('editModal', item)"></i></td>
                <td><i class="fa-regular fa-trash-can text-danger fs-5 cursor-pointer" @click="openDialog('confirmDeleteModal', item)"></i></td>
            </tr>
        </tbody>
    </table>

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
                        <p>{{ timestampFormatter(tempMeasurement.timestamp) }}</p>
                    </div>

                    <!-- Temperature -->
                    <div class="mb-3">
                        <label class="form-label">Temperature</label>
                        <input type="number" v-model="tempMeasurement.temperature" class="form-control" placeholder="Temperature" />
                    </div>

                    <!-- Humidity -->
                    <div class="mb-3">
                        <label class="form-label">Humidity</label>
                        <input type="number" v-model="tempMeasurement.humidity" class="form-control" placeholder="Humidity" />
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