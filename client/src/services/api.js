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

export const getSKUs = async (page = 1, limit = 10) => {
  const response = await api.get('/api/v1/dashboard/skus', {
    params: { page, limit },
  });
  return response.data;
};

export const getScenarios = async () => {
  const response = await api.get('/api/v1/scenarios');
  return response.data;
};

export const selectScenario = async (scenarioId) => {
  const response = await api.post('/api/v1/scenarios/select', {
    scenario_id: scenarioId,
  });
  return response.data;
};

export const submitApproval = async (scenarioId) => {
  const response = await api.post('/api/v1/approval/submit', {
    scenario_id: scenarioId,
  });
  return response.data;
};

export default {
  getKPIs,
  getSKUs,
  getScenarios,
  selectScenario,
  submitApproval,
};
