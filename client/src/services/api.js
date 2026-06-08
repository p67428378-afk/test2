import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getKPIs = async () => {
  const response = await api.get('/api/v1/dashboard/kpis');
  return response.data;
};

export const getSKUs = async () => {
  const response = await api.get('/api/v1/dashboard/skus');
  return response.data;
};

export const getScenarios = async () => {
  const response = await api.get('/api/v1/scenarios');
  return response.data;
};

export const selectScenario = async (scenarioName) => {
  const response = await api.post('/api/v1/scenarios/select', {
    scenario_name: scenarioName,
  });
  return response.data;
};

export const submitApproval = async (approvedBy, scenarioName) => {
  const response = await api.post('/api/v1/approval/submit', {
    approved_by: approvedBy,
    scenario_name: scenarioName,
  });
  return response.data;
};

export default api;