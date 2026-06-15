import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const createOrder = async (orderData) => {
  const response = await api.post('/api/v1/orders', orderData);
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/api/v1/orders/${orderId}`);
  return response.data;
};

export const getPositions = async (traderId) => {
  const response = await api.get(`/api/v1/positions/${traderId}`);
  return response.data;
};

export const getMarketData = async (instrumentId) => {
  const response = await api.get(`/api/v1/market-data/depth/${instrumentId}`);
  return response.data;
};

export const estimateTca = async (tcaData) => {
  const response = await api.post('/api/v1/tca/estimate', tcaData);
  return response.data;
};

export default api;
