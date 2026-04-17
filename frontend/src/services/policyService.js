import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/policies';

const getPolicy = (policyId) => {
  return axios.get(`${API_URL}/${policyId}`);
};

const getPoliciesByHolder = (policyHolderId) => {
  return axios.get(`${API_URL}/holder/${policyHolderId}`);
};

const createPolicy = (policyData) => {
  return axios.post(API_URL, policyData);
};

const updatePolicy = (policyId, policyData) => {
  return axios.put(`${API_URL}/${policyId}`, policyData);
};

const cancelPolicy = (policyId) => {
  return axios.delete(`${API_URL}/${policyId}`);
};

export default {
  getPolicy,
  getPoliciesByHolder,
  createPolicy,
  updatePolicy,
  cancelPolicy,
};
