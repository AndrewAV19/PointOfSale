import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API__BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
});

export default api;