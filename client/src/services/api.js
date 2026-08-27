import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getDocuments = async (skip = 0, limit = 20) => {
  const response = await apiClient.get("/api/v1/documents", {
    params: { skip, limit },
  });
  return response.data;
};

export const getDocument = async (id) => {
  const response = await apiClient.get(`/api/v1/documents/${id}`);
  return response.data;
};

export const createDocument = async (documentData) => {
  const response = await apiClient.post("/api/v1/documents", documentData);
  return response.data;
};

export const updateDocument = async (id, documentData) => {
  const response = await apiClient.put(`/api/v1/documents/${id}`, documentData);
  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await apiClient.delete(`/api/v1/documents/${id}`);
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

export default {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  checkHealth,
};
