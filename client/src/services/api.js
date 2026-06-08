import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getInventory = () => api.get('/api/v1/inventory');

export const requestSnack = (data) => api.post('/api/v1/snacks', data);

export const consumeSnack = (inventoryId, data) => api.put(`/api/v1/inventory/${inventoryId}/consume`, data);

export const updateInventoryItem = (inventoryId, data) => api.put(`/api/v1/inventory/${inventoryId}`, data);

export const getExpiryAlerts = () => api.get('/api/v1/expiry-alerts');

export default api;
