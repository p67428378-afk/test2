import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getKpis = () => {
  return apiClient.get('/api/v1/kpis');
};

export const getSkus = (params) => {
  return apiClient.get('/api/v1/skus', { params });
};
