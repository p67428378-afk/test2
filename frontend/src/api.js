import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1'; // Assuming backend runs on port 8000

export const getProducts = () => {
  return axios.get(`${API_BASE_URL}/products/`);
};

export const createApplicant = (applicantData) => {
  return axios.post(`${API_BASE_URL}/applicants/`, applicantData);
};

export const createApplication = (applicationData) => {
  return axios.post(`${API_BASE_URL}/applications/`, applicationData);
};

export const getApplicationStatus = (applicationId) => {
  return axios.get(`${API_BASE_URL}/applications/${applicationId}`);
};

export const getApplicationsForUser = (userId) => {
  return axios.get(`${API_BASE_URL}/applicants/${userId}/applications/`);
};
