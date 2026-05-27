import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setupLowBalanceAlert = (data) => {
  return apiClient.post('/api/v1/alerts/low-balance', data);
};
