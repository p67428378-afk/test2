import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1/insurance',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const calculatePremium = async (data) => {
  try {
    const response = await apiClient.post('/premium/calculate', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
