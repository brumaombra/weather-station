import GlobalStore from '@/stores/global.js';

const devUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://bruma.cloud:3000';

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

// Show the message dialog
export const showMessageDialog = (message, type, title) => {
    GlobalStore.dialog.title = message;
    GlobalStore.dialog.message = message;
    GlobalStore.dialog.type = type;
    document.getElementById("globalMessageDialogButton").click();
};

// Convert days in milliseconds
export const fromDaysToMilliseconds = days => {
    return days * 24 * 60 * 60 * 1000;
};

// Get min and max date from a date
export const getMaxAndMinFromDate = date => {
    if (!date) return { minDate: null, maxDate: null }; // If no date, exit
    const minDate = new Date(date);
    minDate.setHours(0, 0, 0, 0);
    const maxDate = new Date(date);
    maxDate.setHours(23, 59, 59, 999);
    return { minDate, maxDate };
};

// Set the size of the chart
export const setResponsiveChartSize = chartId => {
    if (window.innerWidth < 992) { // Only if mobile
        const chartDom = document.getElementById(chartId); // Get the DOM element
        chartDom.width = 800; // Set the width of the canvas
        chartDom.height = 600; // Set the height of the canvas
    }
};

// Login attempt
export const loginAttempt = async (username, password) => {
    try {
        const response = await fetch(`${devUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            localStorage.setItem('adminToken', data.token); // Save the token to local storage
            GlobalStore.adminToken = data.token; // Set the token in the global store
            return data;
        } else { // Error
            throw new Error(data.message || 'Error while logging in');
        }
    } catch (error) {
        const newError = new Error('Error while logging in', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Logout the user
export const logout = () => {
    localStorage.removeItem('adminToken'); // Remove the token from local storage
    GlobalStore.adminToken = null; // Clear the token
};

// Validate the token
export const validateSession = async () => {
    try {
        const token = localStorage.getItem('adminToken'); // Get the token from local storage
        const response = await fetch(`${devUrl}/api/validateToken`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            GlobalStore.adminToken = token; // Set the token in the global store
            return data;
        } else { // Error
            logout(); // Logout the user
            throw new Error(data.message || 'Error while validating the token');
        }
    } catch (error) {
        const newError = new Error('Error while validating the token', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get all the measurements
export const getMeasurements = async params => {
    try {
        const query = params ? `?${new URLSearchParams(params)}` : ''; // Get the query parameters
        const response = await fetch(`${devUrl}/api/measurements${query}`); // Get the response
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while reading the measurements');
        }
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get all the aggregated measurements
export const getAggregatedMeasurements = async params => {
    try {
        const query = params ? `?${new URLSearchParams(params)}` : ''; // Get the query parameters
        const response = await fetch(`${devUrl}/api/aggregatedMeasurements${query}`); // Get the response
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while reading the measurements');
        }
    } catch (error) {
        const newError = new Error('Error while reading the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the last measurement
export const getLastMeasurement = async () => {
    try {
        const response = await fetch(`${devUrl}/api/lastMeasurement`); // Get the response
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while reading the measurement');
        }
    } catch (error) {
        const newError = new Error('Error while reading the measurement', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Update a measurement
export const updateMeasurement = async measurement => {
    try {
        const token = GlobalStore.adminToken; // Get the token from the global store
        const response = await fetch(`${devUrl}/api/measurements/${measurement.id}`, { // Get the response
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(measurement)
        });
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while updating the measurements');
        }
    } catch (error) {
        const newError = new Error('Error while updating the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Add a measurement
export const addMeasurement = async measurement => {
    try {
        const response = await fetch(`${devUrl}/api/measurements`, { // Get the response
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(measurement)
        });
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while adding the measurement');
        }
    } catch (error) {
        const newError = new Error('Error while adding the measurement', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Delete multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const token = GlobalStore.adminToken; // Get the token from the global store
        const response = await fetch(`${devUrl}/api/measurements`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ idList: idList })
        });
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while deleting the measurements');
        }
    } catch (error) {
        const newError = new Error('Error while deleting the measurements', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};

// Get the temperature and humidity correlation data
export const getTempHumCorrData = async () => {
    try {
        const response = await fetch(`${devUrl}/api/correlation/temperatureHumidity`); // Get the response
        const data = await response.json(); // Get the data
        if (data.status === 'OK') { // Success
            return data.data;
        } else { // Error
            throw new Error(data.message || 'Error while reading the data');
        }
    } catch (error) {
        const newError = new Error('Error while reading the data', { cause: error }); // Save the old error to the stack
        console.error(newError); // Log the error
        throw newError; // Throw the error
    }
};