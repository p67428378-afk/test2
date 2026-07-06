import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getKPIs = async () => {
  const response = await api.get("/api/v1/kpis");
  return response.data;
};

export const getSKUs = async () => {
  const response = await api.get("/api/v1/skus");
  return response.data;
};

export const calculateScenario = async (scenarioType) => {
  const response = await api.post("/api/v1/scenarios/calculate", {
    scenario_type: scenarioType,
  });
  return response.data;
};

export const submitApproval = async (scenarioType) => {
  const response = await api.post("/api/v1/approvals", {
    scenario_type: scenarioType,
  });
  return response.data;
};

export default api;
