import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
});

export const calculatePremium = async (data) => {
  try {
    const response = await api.post('/api/v1/premiums/calculate', data);
    return response.data;
  } catch (error) {
    console.error('Error calculating premium:', error);
    throw error;
  }
};
