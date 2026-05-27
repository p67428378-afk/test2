import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupAlert = (data) => {
  return apiClient.post('/api/v1/alerts/setup', data);
};

export const verifyOtp = (data) => {
  return apiClient.post('/api/v1/alerts/verify', data);
};
