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
      operand1: Number(operand1),
      operand2: Number(operand2),
      operator,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error(error.message || 'An error occurred during calculation');
  }
};