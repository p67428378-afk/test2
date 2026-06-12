import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8180';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getFlowers = async () => {
  const response = await api.get('/api/v1/flowers');
  return response.data;
};

export const createFlower = async (flowerData) => {
  const response = await api.post('/api/v1/flowers', flowerData);
  return response.data;
};

export const getInventory = async (params = {}) => {
  const response = await api.get('/api/v1/inventory', { params });
  return response.data;
};

export const createInventoryItem = async (inventoryData) => {
  const response = await api.post('/api/v1/inventory', inventoryData);
  return response.data;
};

export const updateInventoryItem = async (inventoryId, updateData) => {
  const response = await api.put(`/api/v1/inventory/${inventoryId}`, updateData);
  return response.data;
};

export const getPlantBatches = async () => {
  const response = await api.get('/api/v1/plant-batches');
  return response.data;
};

export const createPlantBatch = async (batchData) => {
  const response = await api.post('/api/v1/plant-batches', batchData);
  return response.data;
};

export const updatePlantBatch = async (batchId, updateData) => {
  const response = await api.put(`/api/v1/plant-batches/${batchId}`, updateData);
  return response.data;
};

export const submitSensorData = async (sensorData) => {
  const response = await api.post('/api/v1/sensor-data', sensorData);
  return response.data;
};

export const getTasks = async (params = {}) => {
  const response = await api.get('/api/v1/tasks', { params });
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/api/v1/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId, updateData) => {
  const response = await api.put(`/api/v1/tasks/${taskId}`, updateData);
  return response.data;
};

export default api;