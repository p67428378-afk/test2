import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCustomers = async (params = {}) => {
  const response = await api.get('/api/v1/customers', { params });
  return response.data;
};

export const getCustomer = async (id) => {
  const response = await api.get(`/api/v1/customers/${id}`);
  return response.data;
};

export const createCustomer = async (data) => {
  const response = await api.post('/api/v1/customers', data);
  return response.data;
};

export const verifyAadhaarOTP = async (id, otp) => {
  const response = await api.post(`/api/v1/customers/${id}/verify-aadhaar-otp`, { otp });
  return response.data;
};

export const verifyPAN = async (id) => {
  const response = await api.post(`/api/v1/customers/${id}/verify-pan`);
  return response.data;
};

export const runScreening = async (id) => {
  const response = await api.post(`/api/v1/customers/${id}/screening`);
  return response.data;
};

export const getVerifications = async (id) => {
  const response = await api.get(`/api/v1/customers/${id}/verifications`);
  return response.data;
};

export const getScreeningResults = async (id) => {
  const response = await api.get(`/api/v1/customers/${id}/screening`);
  return response.data;
};

export const customerAction = async (id, data) => {
  const response = await api.post(`/api/v1/customers/${id}/action`, data);
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await api.post('/api/v1/transactions', data);
  return response.data;
};

export const getAlerts = async (params = {}) => {
  const response = await api.get('/api/v1/alerts', { params });
  return response.data;
};

export const getReports = async (params = {}) => {
  const response = await api.get('/api/v1/reports', { params });
  return response.data;
};

export const submitReport = async (id) => {
  const response = await api.post(`/api/v1/reports/${id}/submit`);
  return response.data;
};

export default api;