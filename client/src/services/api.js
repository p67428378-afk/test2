import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getKPIs = async () => {
  const response = await apiClient.get('/api/v1/kpis');
  return response.data;
};

export const getSKUs = async () => {
  const response = await apiClient.get('/api/v1/skus');
  return response.data;
};

export const getScenarioDetails = async (scenarioName) => {
  const response = await apiClient.get(`/api/v1/scenarios/${scenarioName}`);
  return response.data;
};

export const submitAssortmentPlan = async (planData) => {
  const response = await apiClient.post('/api/v1/assortment-plans', planData);
  return response.data;
};

export default {
  getKPIs,
  getSKUs,
  getScenarioDetails,
  submitAssortmentPlan,
};
