import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getProjects = async (params = {}) => {
  const response = await apiClient.get("/api/v1/projects", { params });
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await apiClient.get(`/api/v1/projects/${id}`);
  return response.data;
};

export const createLead = async (leadData) => {
  const response = await apiClient.post("/api/v1/leads", leadData);
  return response.data;
};

export const getLeads = async (params = {}) => {
  const response = await apiClient.get("/api/v1/leads", { params });
  return response.data;
};

export default apiClient;
