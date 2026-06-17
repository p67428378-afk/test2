import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getKpis = async () => {
  const response = await api.get("/api/v1/kpis");
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/api/v1/products");
  return response.data;
};

export const getScenarios = async () => {
  const response = await api.get("/api/v1/scenarios");
  return response.data;
};

export const createApprovalRequest = async (scenarioId, userId, userName) => {
  const response = await api.post("/api/v1/approval-requests", {
    scenario_id: scenarioId,
    user_id: userId,
    user_name: userName,
  });
  return response.data;
};

export default api;
