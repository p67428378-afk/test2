import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  createKyc(data) {
    return apiClient.post('/kyc/', data);
  }
};
