import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const calculateExpression = async (expression) => {
  const response = await apiClient.post("/api/v1/calculate", { expression });
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

export default apiClient;
