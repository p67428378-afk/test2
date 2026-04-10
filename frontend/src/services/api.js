import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Adjust this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculatePremium = async (data) => {
  try {
    const response = await apiClient.post('/calculate-premium', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
