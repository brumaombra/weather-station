import { api } from './main.js';

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