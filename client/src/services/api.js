import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getKPIs = async (scenario = 'Balanced') => {
  const response = await api.get('/api/v1/kpis', {
    params: { scenario },
  });
  return response.data;
};

export const getSKUs = async (params = {}) => {
  const response = await api.get('/api/v1/skus', {
    params: {
      scenario: params.scenario || 'Balanced',
      search: params.search || undefined,
      sort_by: params.sort_by || undefined,
      sort_order: params.sort_order || undefined,
      skip: params.skip ?? 0,
      limit: params.limit ?? 50,
    },
  });
  return response.data;
};

export const getScenarios = async (scenario = 'Balanced') => {
  const response = await api.get('/api/v1/scenarios', {
    params: { scenario },
  });
  return response.data;
};

export const submitAssortmentPlan = async (payload) => {
  const response = await api.post('/api/v1/submit', payload);
  return response.data;
};

export default api;
