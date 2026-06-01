import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getTodos = () => api.get('/api/v1/todos');
export const createTodo = (title) => api.post('/api/v1/todos', { title });
export const updateTodo = (id, data) => api.put(`/api/v1/todos/${id}`, data);
export const deleteTodo = (id) => api.delete(`/api/v1/todos/${id}`);
