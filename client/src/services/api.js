import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getKPIs = async () => {
  const response = await api.get('/api/v1/kpis');
  return response.data;
};

export const getSKUsPerformance = async (limit = 20, skip = 0) => {
  const response = await api.get('/api/v1/skus/performance', {
    params: { limit, skip },
  });
  return response.data;
};

export const getScenarios = async () => {
  const response = await api.get('/api/v1/scenarios');
  return response.data;
};

export const createScenario = async (scenarioData) => {
  const response = await api.post('/api/v1/scenarios', scenarioData);
  return response.data;
};

export const getScenarioDetails = async (scenarioId) => {
  const response = await api.get(`/api/v1/scenarios/${scenarioId}`);
  return response.data;
};

export const getScenarioProjections = async () => {
  const response = await api.get('/api/v1/scenarios/projections');
  return response.data;
};

export const submitScenario = async (scenarioId) => {
  const response = await api.post(`/api/v1/scenarios/${scenarioId}/submit`);
  return response.data;
};

export const getAudits = async () => {
  const response = await api.get('/api/v1/audits');
  return response.data;
};

export default api;
