import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardSummary = async () => {
  const response = await api.get('/api/v1/dashboard/summary');
  return response.data;
};

export const getBudgetVariance = async () => {
  const response = await api.get('/api/v1/dashboard/budget-variance');
  return response.data;
};

export const allocateEmergencyFund = async (payload) => {
  const response = await api.post('/api/v1/dashboard/allocate-emergency-fund', payload);
  return response.data;
};

export const getEmergencyFundTransactions = async () => {
  const response = await api.get('/api/v1/dashboard/emergency-fund-transactions');
  return response.data;
};

export const downloadParliamentaryReport = async () => {
  const response = await api.get('/api/v1/dashboard/report');
  return response.data;
};

export default api;
