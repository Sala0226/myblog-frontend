import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getPosts    = ()           => API.get('/posts');
export const createPost  = (data)       => API.post('/posts', data);
export const likePost    = (id)         => API.post(`/posts/${id}/like`);
export const commentPost = (id, data)   => API.post(`/posts/${id}/comment`, data);