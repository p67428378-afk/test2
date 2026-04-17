
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPolicyHolder = (policyHolderId) => {
  return apiClient.get(`/policy-holders/${policyHolderId}`);
};

export const getPolicy = (policyId) => {
  return apiClient.get(`/policies/${policyId}`);
};

export const updatePolicyHolder = (policyHolderId, data) => {
  return apiClient.put(`/policy-holders/${policyHolderId}`, data);
};

export const cancelPolicy = (policyId) => {
  return apiClient.put(`/policies/${policyId}/cancel`);
};
