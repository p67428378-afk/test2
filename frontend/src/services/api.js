
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Adjust this to your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createKycRequest = (data) => {
  return apiClient.post('/kyc/', data);
};

export const getKycRequest = (id) => {
  return apiClient.get(`/kyc/${id}`);
};

export const validateKycRequest = (id) => {
  return apiClient.post(`/kyc/${id}/validate`);
};
