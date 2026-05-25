
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAccounts = () => {
  return apiClient.get('/accounts/');
};

export const getUserAccounts = (userId) => {
    return apiClient.get(`/users/${userId}/accounts/`);
};
