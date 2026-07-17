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

export const getSKUs = async (status = "") => {
  const params = status ? { status } : {};
  const response = await api.get("/api/v1/skus", { params });
  return response.data;
};

export const calculateScenario = async (scenarioName) => {
  const response = await api.post("/api/v1/scenarios/calculate", {
    scenario_name: scenarioName,
  });
  return response.data;
};

export const submitAssortmentReview = async (scenarioName) => {
  const response = await api.post("/api/v1/assortment-reviews", {
    scenario_name: scenarioName,
  });
  return response.data;
};

export default api;
