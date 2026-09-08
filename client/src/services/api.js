import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateRecommendations = async (requestData) => {
  const response = await apiClient.post("/api/v1/recommendations", requestData);
  return response.data;
};

export const getRecommendationById = async (recommendationId) => {
  const response = await apiClient.get(
    `/api/v1/recommendations/${recommendationId}`,
  );
  return response.data;
};

export const checkHealth = async () => {
  const response = await apiClient.get("/api/v1/health");
  return response.data;
};

export default {
  generateRecommendations,
  getRecommendationById,
  checkHealth,
};
