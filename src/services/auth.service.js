import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/api/auth' });
// const API = axios.create({ baseURL: 'https://myblog-api-oq9i.onrender.com/api' });
const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

export const login = (data) => API.post('/login', data);
export const register = (data) => API.post('/register', data);