import axios from 'axios';

const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://station.bruma.cloud';

// Create axios instance
export const api = axios.create({
    baseURL: serverUrl
});