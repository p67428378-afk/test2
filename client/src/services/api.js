import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSnacksData = async () => {
  const response = await api.get('/api/v1/assortment-advisor/snacks');
  return response.data;
};

export const submitReview = async (scenario, actions) => {
  const response = await api.post('/api/v1/assortment-advisor/review', {
    scenario,
    actions,
  });
  return response.data;
};

export default api;
