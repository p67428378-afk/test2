import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getReviews = async (limit = 20, skip = 0) => {
  const response = await api.get('/api/v1/reviews', {
    params: { limit, skip },
  });
  return response.data;
};

export const getReviewDetails = async (id) => {
  const response = await api.get(`/api/v1/reviews/${id}`);
  return response.data;
};

export const getConfig = async () => {
  const response = await api.get('/api/v1/config');
  return response.data;
};

export const updateConfig = async (configData) => {
  const response = await api.put('/api/v1/config', configData);
  return response.data;
};

export default api;
