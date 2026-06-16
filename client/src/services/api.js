import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCurrentUser = () => api.get('/api/v1/users/me');
export const getVisualizationData = (params) => api.get('/api/v1/data/visualization', { params });
export const getNWPModels = (params) => api.get('/api/v1/forecasts/nwp-models', { params });
export const getForecastGrids = () => api.get('/api/v1/forecasts/grids');
export const updateForecastGrid = (gridId, data) => api.put(`/api/v1/forecasts/grids/${gridId}`, data);
export const getWarnings = (params) => api.get('/api/v1/warnings', { params });
export const issueWarning = (data) => api.post('/api/v1/warnings', data);
export const updateWarning = (warningId, data) => api.put(`/api/v1/warnings/${warningId}`, data);
export const getTextProducts = () => api.get('/api/v1/products/text');
export const createTextProduct = (data) => api.post('/api/v1/products/text', data);

export default api;
