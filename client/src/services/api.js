import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthEmail = (email) => {
  if (email) {
    apiClient.defaults.headers.common["X-User-Email"] = email;
  } else {
    delete apiClient.defaults.headers.common["X-User-Email"];
  }
};

// Default test user
setAuthEmail("test@example.com");

export const getProfile = async () => {
  const response = await apiClient.get("/api/v1/profiles/me");
  return response.data;
};

export const addSkill = async (skillData) => {
  const response = await apiClient.post("/api/v1/profiles/skills", skillData);
  return response.data;
};

export const removeSkill = async (userSkillId) => {
  const response = await apiClient.delete(
    `/api/v1/profiles/skills/${userSkillId}`,
  );
  return response.data;
};

export const getMatches = async (params = {}) => {
  const response = await apiClient.get("/api/v1/matches", { params });
  return response.data;
};

export const createExchangeRequest = async (requestData) => {
  const response = await apiClient.post("/api/v1/exchanges", requestData);
  return response.data;
};

export const getExchangeRequests = async (params = {}) => {
  const response = await apiClient.get("/api/v1/exchanges", { params });
  return response.data;
};

export const updateExchangeStatus = async (exchangeId, action) => {
  const response = await apiClient.patch(
    `/api/v1/exchanges/${exchangeId}/status`,
    { action },
  );
  return response.data;
};

export default apiClient;
