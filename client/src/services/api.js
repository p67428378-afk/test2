import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Order endpoints
export const createOrder = (order) => apiClient.post('/orders', order);
export const getOrder = (orderId) => apiClient.get(`/orders/${orderId}`);
// In a real app, you'd have a getOrders endpoint
// export const getOrders = () => apiClient.get('/orders');

// Position endpoints
export const getPositions = (traderId) => apiClient.get(`/positions/${traderId}`);

// Market Data endpoints
export const getMarketDepth = (instrumentId) => apiClient.get(`/market-data/depth/${instrumentId}`);

// TCA endpoints
export const estimateTca = (trade) => apiClient.post('/tca/estimate', trade);

export default apiClient;
