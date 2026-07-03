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

export const getSKUs = async (params = {}) => {
  const response = await api.get("/api/v1/skus", { params });
  return response.data;
};

export const getScenarioProjections = async (scenarioName) => {
  const response = await api.post("/api/v1/scenarios", {
    scenario_name: scenarioName,
  });
  return response.data;
};

export const submitDecision = async (scenarioName, skuActions) => {
  const response = await api.post("/api/v1/decisions", {
    scenario_name: scenarioName,
    sku_actions: skuActions,
  });
  return response.data;
};

export default api;
