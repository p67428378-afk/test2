import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const createOrder = (order) => api.post('/api/v1/orders', order);
export const getOrder = (orderId) => api.get(`/api/v1/orders/${orderId}`);
export const getPositions = (traderId) => api.get(`/api/v1/positions/${traderId}`);
export const getMarketData = (instrumentId) => api.get(`/api/v1/market-data/depth/${instrumentId}`);
export const estimateTca = (trade) => api.post('/api/v1/tca/estimate', trade);

export default api;
