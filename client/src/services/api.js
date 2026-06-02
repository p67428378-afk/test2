
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const registerUser = (userData) => {
  return apiClient.post('/api/v1/users/register', userData);
};

export const getUser = (userId) => {
  return apiClient.get(`/api/v1/users/${userId}`);
};

export const configureAlerts = (configData) => {
  return apiClient.post('/api/v1/alerts/config', configData);
};

export const getAlertConfig = (userId) => {
  return apiClient.get(`/api/v1/alerts/config/${userId}`);
};

export const updateAlertConfig = (userId, configData) => {
  return apiClient.put(`/api/v1/alerts/config/${userId}`, configData);
};

export const getWaterUsage = (userId, params) => {
  return apiClient.get(`/api/v1/usage/${userId}`, { params });
};
