import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkEligibility = async (data) => {
  try {
    const response = await apiClient.post('/loan/check-eligibility', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
