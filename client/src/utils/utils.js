import GlobalStore from '@/stores/store.js';

const devUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

// Set the busy state of the app
export const setBusy = busy => {
    if (GlobalStore.busy === busy) return; // Exit if it's already equal
    GlobalStore.busy = busy;
};

// Show the message toast
export const showToast = (message, type, time) => {
    GlobalStore.toast.message = message;
    GlobalStore.toast.type = type;
    GlobalStore.toast.visible = true;
    setTimeout(() => { // Hide the toast after 5 seconds
        GlobalStore.toast.visible = false; // Hide the toast
    }, time || 3000);
};

// Get all the measurements
export const getMeasurements = (success, error, params) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    fetch(`${devUrl}/api/measurements${query}`).then(response => {
        return response.json();
    }).then(data => {
        if (success) success(data);
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Get all the aggregated measurements
export const getAggregatedMeasurements = (success, error, params) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    fetch(`${devUrl}/api/aggregatedMeasurements${query}`).then(response => {
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

// Delete multiple measurements
export const deleteMeasurements = (idList, success, error) => {
    fetch(`${devUrl}/api/measurements`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idList: idList })
    }).then(response => {
        return response.json();
    }).then(data => {
        if (success) success(data);
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};