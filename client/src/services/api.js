import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardMetrics = async () => {
  const response = await api.get('/api/v1/reports/dashboard');
  return response.data;
};

export const getProfitabilityReport = async () => {
  const response = await api.get('/api/v1/reports/profitability');
  return response.data;
};

export const getInventory = async (skip = 0, limit = 50) => {
  const response = await api.get('/api/v1/inventory', { params: { skip, limit } });
  return response.data;
};

export const addInventoryItem = async (product) => {
  const response = await api.post('/api/v1/inventory', product);
  return response.data;
};

export const updateInventoryItem = async (productId, product) => {
  const response = await api.put(`/api/v1/inventory/${productId}`, product);
  return response.data;
};

export const deleteInventoryItem = async (productId) => {
  const response = await api.delete(`/api/v1/inventory/${productId}`);
  return response.data;
};

export const getCustomers = async (skip = 0, limit = 50) => {
  const response = await api.get('/api/v1/customers', { params: { skip, limit } });
  return response.data;
};

export const addCustomer = async (customer) => {
  const response = await api.post('/api/v1/customers', customer);
  return response.data;
};

export const getQuotes = async (skip = 0, limit = 50) => {
  const response = await api.get('/api/v1/quotes', { params: { skip, limit } });
  return response.data;
};

export const createQuote = async (quote) => {
  const response = await api.post('/api/v1/quotes', quote);
  return response.data;
};

export const convertQuoteToOrder = async (quoteId) => {
  const response = await api.post(`/api/v1/quotes/${quoteId}/convert`);
  return response.data;
};

export const getOrders = async (skip = 0, limit = 50) => {
  const response = await api.get('/api/v1/orders', { params: { skip, limit } });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/api/v1/orders/${orderId}/status`, { status });
  return response.data;
};

export const submitOrderFeedback = async (orderId, feedback) => {
  const response = await api.post(`/api/v1/orders/${orderId}/feedback`, feedback);
  return response.data;
};

export const getCustomerInteractions = async (customerId) => {
  const response = await api.get(`/api/v1/customers/${customerId}/interactions`);
  return response.data;
};

export const logCustomerInteraction = async (customerId, interaction) => {
  const response = await api.post(`/api/v1/customers/${customerId}/interactions`, interaction);
  return response.data;
};

export default api;