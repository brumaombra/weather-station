import GlobalStore from '@/stores/global.js';

const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://station.bruma.cloud';

// Login attempt
export const loginAttempt = async (username, password, rememberMe) => {
    try {
        const response = await fetch(`${serverUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            if (rememberMe) localStorage.setItem('adminToken', data.token); // Save the token to local storage if needed
            GlobalStore.adminToken = data.token; // Set the token in the global store
            return data;
        } else { // Error
            throw new CustomError(data.message || 'Error while logging in');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while logging in');
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
        const response = await fetch(`${serverUrl}/auth/validateToken`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            GlobalStore.adminToken = token; // Set the token in the global store
            return data;
        } else { // Error
            logout(); // Logout the user
            throw new CustomError(data.message || 'Error while validating the token');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while validating the token');
    }
};

// Get all the measurements
export const getMeasurements = async params => {
    try {
        const query = params ? `?${new URLSearchParams(params)}` : ''; // Get the query parameters
        const response = await fetch(`${serverUrl}/api/measurements${query}`); // Get the response
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            return data;
        } else { // Error
            throw new CustomError(data.message || 'Error while reading the measurements');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while reading the measurements');
    }
};

// Get all the aggregated measurements
export const getAggregatedMeasurements = async params => {
    try {
        const query = params ? `?${new URLSearchParams(params)}` : ''; // Get the query parameters
        const response = await fetch(`${serverUrl}/api/measurements/aggregated${query}`); // Get the response
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            return data;
        } else { // Error
            throw new CustomError(data.message || 'Error while reading the measurements');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while reading the measurements');
    }
};

// Get the last measurement
export const getLastMeasurement = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/measurements/last`); // Get the response
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            return data;
        } else { // Error
            throw new CustomError(data.message || 'Error while reading the measurement');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while reading the measurement');
    }
};

// Update a measurement
export const updateMeasurement = async measurement => {
    try {
        const token = GlobalStore.adminToken; // Get the token from the global store
        const response = await fetch(`${serverUrl}/api/measurements/${measurement.id}`, { // Get the response
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(measurement)
        });
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            return data;
        } else { // Error
            throw new CustomError(data.message || 'Error while updating the measurement');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while updating the measurement');
    }
};

// Delete multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const token = GlobalStore.adminToken; // Get the token from the global store
        const response = await fetch(`${serverUrl}/api/measurements`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ idList: idList })
        });
        const data = await response.json(); // Get the data
        if (response.ok) { // Success
            return data;
        } else { // Error
            throw new CustomError(data.message || 'Error while deleting the measurement');
        }
    } catch (error) {
        console.error(error); // Log the error
        throw error.isCustom ? error : new CustomError('Error while deleting the measurement');
    }
};