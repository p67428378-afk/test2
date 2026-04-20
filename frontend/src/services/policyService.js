import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const getPolicies = async () => {
  const response = await axios.get(`${API_URL}/policies/`);
  return response.data;
};

export const getPolicy = async (id) => {
  const response = await axios.get(`${API_URL}/policies/${id}`);
  return response.data;
};

export const createPolicy = async (policy) => {
  const response = await axios.post(`${API_URL}/policies/`, policy);
  return response.data;
};

export const updatePolicy = async (id, policy) => {
  const response = await axios.put(`${API_URL}/policies/${id}`, policy);
  return response.data;
};

export const deletePolicy = async (id) => {
  const response = await axios.delete(`${API_URL}/policies/${id}`);
  return response.data;
};
