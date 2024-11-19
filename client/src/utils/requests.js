import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://station.bruma.cloud';

// Create axios instance
const api = axios.create({
    baseURL: serverUrl
});

// Login to the server
export const login = async (username, password) => {
    try {
        const { data } = await api.post(`/auth/login`, { username, password }, { // Send the request
            withCredentials: true // Send cookies with the request
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while logging in');
    }
};

// Logout the user
export const logout = async () => {
    try {
        const { data } = await api.post(`/auth/logout`, {}, {
            withCredentials: true // Send cookies with the request
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while logging out');
    }
};

// Validate the token
export const validateToken = async () => {
    try {
        const { data } = await api.get('/auth/validateToken', {
            withCredentials: true // Send cookies with the request
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while validating the token');
    }
};

// Get all the measurements
export const getMeasurements = async params => {
    try {
        const { data } = await api.get('/api/measurements', { params });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while reading the measurements');
    }
};

// Get all the aggregated measurements
export const getAggregatedMeasurements = async params => {
    try {
        const { data } = await api.get('/api/measurements/aggregated', { params });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while reading the measurements');
    }
};

// Get the last measurement
export const getLastMeasurement = async () => {
    try {
        const { data } = await api.get('/api/measurements/last');
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while reading the measurement');
    }
};

// Update a measurement
export const updateMeasurement = async measurement => {
    try {
        const { data } = await api.put(`/api/measurements/${measurement.id}`, measurement, {
            withCredentials: true
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while updating the measurement');
    }
};

// Delete multiple measurements
export const deleteMeasurements = async idList => {
    try {
        const { data } = await api.delete('/api/measurements', {
            withCredentials: true,
            data: { idList }
        });
        return data;
    } catch (error) {
        console.error(error);
        throw new Error(error.response?.data?.message || 'Error while deleting the measurement');
    }
};