import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getSubjects = async () => {
  const response = await api.get("/api/v1/schemas");
  return response.data;
};

export const updateCompatibility = async (subject, compatibilityLevel) => {
  const response = await api.put(`/api/v1/config/${subject}`, {
    compatibility_level: compatibilityLevel,
  });
  return response.data;
};

export const getVersions = async (subject) => {
  const response = await api.get(`/api/v1/schemas/${subject}/versions`);
  return response.data;
};

export const getLatestVersion = async (subject) => {
  const response = await api.get(`/api/v1/schemas/${subject}/versions/latest`);
  return response.data;
};

export const registerVersion = async (subject, schemaDefinition) => {
  const response = await api.post(`/api/v1/schemas/${subject}/versions`, {
    schema_definition: schemaDefinition,
  });
  return response.data;
};

export const getValidationLogs = async () => {
  const response = await api.get("/api/v1/validation-logs");
  return response.data;
};

export default api;
