import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getPolicy = (policyId) => {
  return apiClient.get(`/policies/${policyId}`);
};

export const createPolicyUpdateRequest = (data) => {
  return apiClient.post('/policies/requests/', data);
};

export const createPolicyCancelRequest = (data) => {
  return apiClient.post('/policies/requests/', data);
};
