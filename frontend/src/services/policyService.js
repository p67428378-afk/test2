import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const getPolicies = () => {
  return axios.get(`${API_URL}/policies/`);
};

const getPolicy = (id) => {
  return axios.get(`${API_URL}/policies/${id}`);
};

const createPolicy = (policy) => {
  return axios.post(`${API_URL}/policies/`, policy);
};

const updatePolicy = (id, policy) => {
  return axios.put(`${API_URL}/policies/${id}`, policy);
};

const deletePolicy = (id) => {
  return axios.delete(`${API_URL}/policies/${id}`);
};

export default {
  getPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
};
