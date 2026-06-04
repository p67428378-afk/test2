import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculatePremium = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/insurance/premium', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createPolicy = async (data) => {
  try {
    const response = await apiClient.post('/api/v1/policies', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPolicy = async (policyId) => {
  try {
    const response = await apiClient.get(`/api/v1/policies/${policyId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
