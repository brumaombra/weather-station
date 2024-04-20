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

// Convert days in milliseconds
export const fromDaysToMilliseconds = days => {
    return days * 24 * 60 * 60 * 1000;
};

// Login attempt
export const loginAttempt = (username, password, success, error) => {
    fetch(`${devUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            localStorage.setItem('adminToken', data.token); // Save the token to local storage
            GlobalStore.adminToken = data.token; // Set the token in the global store
            if (success) success(data);
        } else { // Error
            if (error) error(data);
        }
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Logout the user
export const logout = () => {
    localStorage.removeItem('adminToken'); // Remove the token from local storage
    GlobalStore.adminToken = null; // Clear the token
};

// Validate the token
export const validateSession = (success, error) => {
    const token = localStorage.getItem('adminToken'); // Get the token from local storage
    fetch(`${devUrl}/api/validateToken`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            GlobalStore.adminToken = token; // Set the token in the global store
            if (success) success(data);
        } else { // Error
            logout(); // Logout the user
            if (error) error(data);
        }
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Get all the measurements
export const getMeasurements = (success, error, params) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    fetch(`${devUrl}/api/measurements${query}`).then(response => {
        return response.json();
    }).then(data => {
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            if (success) success(data);
        } else { // Error
            if (error) error(data);
        }
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
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            if (success) success(data);
        } else { // Error
            if (error) error(data);
        }
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Update a measurement
export const updateMeasurement = (measurement, success, error) => {
    const token = GlobalStore.adminToken; // Get the token from the global store
    fetch(`${devUrl}/api/measurements/${measurement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(measurement)
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            if (success) success(data);
        } else { // Error
            if (error) error(data);
        }
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
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            if (success) success(data);
        } else { // Error
            if (error) error(data);
        }
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};

// Delete multiple measurements
export const deleteMeasurements = (idList, success, error) => {
    const token = GlobalStore.adminToken; // Get the token from the global store
    fetch(`${devUrl}/api/measurements`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ idList: idList })
    }).then(response => {
        return response.json();
    }).then(data => {
        if (data.status === 'OK') { // Success
            delete data.status; // Delete the status
            if (success) success(data);
        } else { // Error
            if (error) error(data);
        }
    }).catch(errorResponse => {
        if (error) error(errorResponse);
    });
};