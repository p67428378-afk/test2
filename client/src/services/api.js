import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPipelines = async () => {
  const response = await api.get('/api/v1/pipelines');
  return response.data;
};

export const getPipelineSensors = async (pipelineId) => {
  const response = await api.get(`/api/v1/pipelines/${pipelineId}/sensors`);
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get('/api/v1/alerts');
  return response.data;
};

export const acknowledgeAlert = async (alertId) => {
  const response = await api.put(`/api/v1/alerts/${alertId}/acknowledge`);
  return response.data;
};

export const getMaintenanceOrders = async () => {
  const response = await api.get('/api/v1/maintenance');
  return response.data;
};

export const createMaintenanceOrder = async (orderData) => {
  const response = await api.post('/api/v1/maintenance', orderData);
  return response.data;
};

export const updateMaintenanceOrder = async (orderId, updateData) => {
  const response = await api.put(`/api/v1/maintenance/${orderId}`, updateData);
  return response.data;
};

export default api;
