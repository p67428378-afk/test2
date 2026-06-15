import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async (skip = 0, limit = 100) => {
  const response = await api.get('/api/v1/tasks', {
    params: { skip, limit },
  });
  return response.data;
};

export const createTask = async (description) => {
  const response = await api.post('/api/v1/tasks', { description });
  return response.data;
};

export const getTask = async (taskId) => {
  const response = await api.get(`/api/v1/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (taskId, updates) => {
  const response = await api.put(`/api/v1/tasks/${taskId}`, updates);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/api/v1/tasks/${taskId}`);
  return response.data;
};

export default api;
