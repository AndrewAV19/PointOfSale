import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API__BASE_URL,
});

export default api;