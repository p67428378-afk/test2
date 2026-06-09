import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardData = async () => {
  try {
    const response = await api.get('/api/v1/dashboard-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getScenarioData = async (scenarioName) => {
  try {
    const response = await api.get(`/api/v1/scenario/${scenarioName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scenario data for ${scenarioName}:`, error);
    throw error;
  }
};

export const submitAssortment = async (payload) => {
  try {
    const response = await api.post('/api/v1/submit-assortment', payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting assortment plan:', error);
    throw error;
  }
};

export default api;