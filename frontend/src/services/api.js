import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generatePdfStatement = (data) => {
  return apiClient.post('/statements/pdf', data, { responseType: 'blob' });
};

export const generateExcelStatement = (data) => {
  return apiClient.post('/statements/excel', data, { responseType: 'blob' });
};
