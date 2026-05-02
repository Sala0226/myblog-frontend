import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/admin' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getStats   = ()                    => API.get('/stats');
export const getUsers   = (page = 1, search = '') => API.get(`/users?page=${page}&search=${encodeURIComponent(search)}`);
export const getPosts   = (page = 1, search = '') => API.get(`/posts?page=${page}&search=${encodeURIComponent(search)}`);
export const getImages  = (page = 1)            => API.get(`/images?page=${page}`);
export const deleteUser = (userId)              => API.delete(`/users/${userId}`);
export const deletePost = (postId)              => API.delete(`/posts/${postId}`);