// src/services/api.js
import axios from 'axios';
import config from '../config.js';

// Create a configured Axios instance
const api = axios.create({
    baseURL: config.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to automatically attach the JWT token if a user is logged in
api.interceptors.request.use(
    (requestConfig) => {
        // We will store the token in localStorage when the user logs in
        const token = localStorage.getItem('token');
        
        if (token) {
            requestConfig.headers.Authorization = `Bearer ${token}`;
        }
        return requestConfig;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;