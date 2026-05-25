import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTransactions = () => {
  return apiClient.get('/transactions/');
};

export const createTransaction = (transactionData) => {
  return apiClient.post('/transactions/', transactionData);
};

export const getTransaction = (id) => {
  return apiClient.get(`/transactions/${id}`);
};

export const updateTransaction = (id, updateData) => {
  return apiClient.patch(`/transactions/${id}`, updateData);
};
