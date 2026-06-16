import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getKpis = async (scenario) => {
  const params = {};
  if (scenario) {
    params.scenario = scenario;
  }
  const response = await api.get('/api/v1/kpis', { params });
  return response.data;
};

export const getSkus = async (scenario) => {
  const params = {};
  if (scenario) {
    params.scenario = scenario;
  }
  const response = await api.get('/api/v1/skus', { params });
  return response.data;
};

export const submitDecision = async (decisionData) => {
  const response = await api.post('/api/v1/decisions', decisionData);
  return response.data;
};

export default api;
