import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const API = axios.create({
    baseURL: `${API_BASE}/api`,
});

// Add token to requests if in admin mode
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export default API;

export { API_BASE };
