import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Items
export const getItems = (params) => apiClient.get('/api/v1/items', { params });
export const createItem = (data) => apiClient.post('/api/v1/items', data);
export const getItem = (id) => apiClient.get(`/api/v1/items/${id}`);
export const updateItem = (id, data) => apiClient.put(`/api/v1/items/${id}`, data);

// Sales
export const recordSale = (data) => apiClient.post('/api/v1/sales', data);
export const getSalesHistory = (params) => apiClient.get('/api/v1/sales/history', { params });

// Customers
export const getCustomers = (params) => apiClient.get('/api/v1/customers', { params });
export const createCustomer = (data) => apiClient.post('/api/v1/customers', data);
export const getCustomer = (id) => apiClient.get(`/api/v1/customers/${id}`);
export const updateCustomer = (id, data) => apiClient.put(`/api/v1/customers/${id}`, data);

// Reports
export const getBestsellersReport = () => apiClient.get('/api/v1/reports/bestsellers');
export const getSlowmoversReport = () => apiClient.get('/api/v1/reports/slowmovers');
export const getProfitabilityReport = () => apiClient.get('/api/v1/reports/profitability');

const api = {
    getItems,
    createItem,
    getItem,
    updateItem,
    recordSale,
    getSalesHistory,
    getCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    getBestsellersReport,
    getSlowmoversReport,
    getProfitabilityReport,
};

export default api;
