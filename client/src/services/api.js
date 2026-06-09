import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculate = async (operand1, operand2, operator) => {
  try {
    const response = await api.post('/api/v1/calculate', {
      operand1: parseFloat(operand1),
      operand2: parseFloat(operand2),
      operator,
    });
    return response.data;
  } catch (error) {
    console.error('Error performing calculation:', error);
    throw error;
  }
};

export const getCalculations = async () => {
  try {
    const response = await api.get('/api/v1/calculations');
    return response.data;
  } catch (error) {
    console.error('Error fetching calculations:', error);
    throw error;
  }
};

export const clearCalculations = async () => {
  try {
    const response = await api.delete('/api/v1/calculations');
    return response.data;
  } catch (error) {
    console.error('Error clearing calculations:', error);
    throw error;
  }
};

export default api;