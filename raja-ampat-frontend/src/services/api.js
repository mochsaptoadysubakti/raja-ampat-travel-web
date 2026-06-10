import axios from 'axios';

// Gunakan link Railway jika sudah di-deploy, atau localhost jika sedang coding di laptop
const backendUrl = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: backendUrl,
});

export default api;