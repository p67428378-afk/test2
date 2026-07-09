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

export const getSKUPerformance = async (skip = 0, limit = 10) => {
  const response = await api.get(
    `/api/v1/sku-performance?skip=${skip}&limit=${limit}`,
  );
  return response.data;
};

export const getScenarioProjections = async (scenarioType) => {
  const response = await api.post("/api/v1/scenario-projections", {
    scenario_type: scenarioType,
  });
  return response.data;
};

export const submitAssortmentDecision = async (scenarioType) => {
  const response = await api.post("/api/v1/assortment-decisions", {
    scenario_type: scenarioType,
  });
  return response.data;
};

export default api;
