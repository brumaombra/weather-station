import GlobalStore from '@/stores/store.js';

const devUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

// Set the busy state of the app
export const setBusy = busy => {
    GlobalStore.busy = busy;
};

// Get all the measurements
export const getMeasurements = (success, error) => {
    fetch(`${devUrl}/api/measurements`).then(response => {
        return response.json();
    }).then(data => {
        if (success) success(data);
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Update a measurement
export const updateMeasurement = (measurement, success, error) => {
    fetch(`${devUrl}/api/measurements/${measurement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurement)
    }).then(response => {
        return response.json();
    }).then(data => {
        if (success) success(data);
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Add a measurement
export const addMeasurement = (measurement, success, error) => {
    fetch(`${devUrl}/api/measurements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurement)
    }).then(response => {
        return response.json();
    }).then(data => {
        if (success) success(data);
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Delete a measurement
export const deleteMeasurement = (id, success, error) => {
    fetch(`${devUrl}/api/measurements/${id}`, {
        method: 'DELETE'
    }).then(response => {
        return response.json();
    }).then(data => {
        if (success) success(data);
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};