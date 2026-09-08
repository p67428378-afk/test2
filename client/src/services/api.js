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

export const exportItinerary = async (payload) => {
  const response = await apiClient.post(
    "/api/v1/recommendations/export",
    payload,
  );
  return response.data;
};

export const getCodebaseReport = async (issueKey = "SCRUM-231") => {
  const response = await apiClient.get("/api/v1/codebase-analyzer/report", {
    params: { issue_key: issueKey },
  });
  return response.data;
};

export const triggerCodebaseAnalysis = async (payload = {}) => {
  const response = await apiClient.post(
    "/api/v1/codebase-analyzer/run",
    payload,
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
  exportItinerary,
  getCodebaseReport,
  triggerCodebaseAnalysis,
  checkHealth,
};
