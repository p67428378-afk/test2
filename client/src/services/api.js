import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

// Accounts
export const getAccounts = () => api.get('/accounts');
export const getAccountTransactions = (accountId, params) => api.get(`/accounts/${accountId}/transactions`, { params });

// Transfers
export const createTransfer = (transferData) => api.post('/transfers', transferData);

export default api;
