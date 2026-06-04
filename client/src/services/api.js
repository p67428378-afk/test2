import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculatePremium = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/insurance/premium/calculate', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating premium:', error);
    throw error;
  }
};
