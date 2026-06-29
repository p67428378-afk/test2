import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getKpis = async () => {
  const response = await api.get("/api/v1/kpis");
  return response.data;
};

export const getSkus = async () => {
  const response = await api.get("/api/v1/skus");
  return response.data;
};

export const getScenarioDetails = async (scenarioName) => {
  const response = await api.post(`/api/v1/scenarios/${scenarioName}`);
  return response.data;
};

export const submitApproval = async (payload) => {
  const response = await api.post("/api/v1/approvals", payload);
  return response.data;
};

export default api;
