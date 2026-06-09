import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardKPIs = async () => {
  const response = await api.get('/api/v1/dashboard/kpis');
  return response.data;
};

export const getSKUPerformance = async (params = {}) => {
  const response = await api.get('/api/v1/dashboard/sku-performance', { params });
  return response.data;
};

export const getDefaultScenarios = async () => {
  const response = await api.get('/api/v1/scenarios/default');
  return response.data;
};

export const recalculateScenario = async (payload) => {
  const response = await api.post('/api/v1/scenarios/recalculate', payload);
  return response.data;
};

export const submitApproval = async (payload) => {
  const response = await api.post('/api/v1/approval/submit', payload);
  return response.data;
};

export const getConfirmation = async (auditId) => {
  const response = await api.get(`/api/v1/confirmation/${auditId}`);
  return response.data;
};

export default api;
