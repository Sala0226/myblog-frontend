import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getPosts = (page = 1, limit = 6, search = '') =>
  API.get(`/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
export const createPost   = (data) => API.post('/posts', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updatePost = (id, data) => API.put(`/posts/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost    = (id)         => API.post(`/posts/${id}/like`);
export const commentPost = (id, data)   => API.post(`/posts/${id}/comment`, data);
export const updateComment = (postId, commentId, data) => API.put(`/posts/${postId}/comment/${commentId}`, data);
export const getPostsByUser    = (userId) => API.get(`/posts/user/${userId}`);
export const toggleVisibility  = (id)     => API.put(`/posts/${id}/visibility`);