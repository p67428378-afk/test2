import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8180';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const bodiesApi = {
  register: async (data) => {
    const response = await api.post('/api/v1/bodies', data);
    return response.data;
  },
  list: async (params = {}) => {
    const response = await api.get('/api/v1/bodies', { params });
    return response.data;
  },
  get: async (bodyId) => {
    const response = await api.get(`/api/v1/bodies/${bodyId}`);
    return response.data;
  },
  update: async (bodyId, data) => {
    const response = await api.put(`/api/v1/bodies/${bodyId}`, data);
    return response.data;
  },
};

export const funeralsApi = {
  create: async (data) => {
    const response = await api.post('/api/v1/funerals', data);
    return response.data;
  },
  list: async (params = {}) => {
    const response = await api.get('/api/v1/funerals', { params });
    return response.data;
  },
  get: async (funeralId) => {
    const response = await api.get(`/api/v1/funerals/${funeralId}`);
    return response.data;
  },
  update: async (funeralId, data) => {
    const response = await api.put(`/api/v1/funerals/${funeralId}`, data);
    return response.data;
  },
};

export const invoicesApi = {
  create: async (data) => {
    const response = await api.post('/api/v1/invoices', data);
    return response.data;
  },
  list: async (params = {}) => {
    const response = await api.get('/api/v1/invoices', { params });
    return response.data;
  },
  get: async (invoiceId) => {
    const response = await api.get(`/api/v1/invoices/${invoiceId}`);
    return response.data;
  },
  update: async (invoiceId, data) => {
    const response = await api.put(`/api/v1/invoices/${invoiceId}`, data);
    return response.data;
  },
};

export default api;