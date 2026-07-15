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

export const getSKUs = async (sortBy = "", filterStatus = "") => {
  const params = {};
  if (sortBy) params.sort_by = sortBy;
  if (filterStatus) params.filter_status = filterStatus;
  const response = await api.get("/api/v1/skus", { params });
  return response.data;
};

export const getScenario = async (scenarioName) => {
  const response = await api.get(`/api/v1/scenarios/${scenarioName}`);
  return response.data;
};

export const submitAssortmentPlan = async (
  scenarioName,
  submittedBy = "manager@dollargeneral.com",
) => {
  const response = await api.post("/api/v1/assortment-plans", {
    scenario_name: scenarioName,
    submitted_by: submittedBy,
  });
  return response.data;
};

export const getAssortmentPlan = async (planId) => {
  const response = await api.get(`/api/v1/assortment-plans/${planId}`);
  return response.data;
};

export default api;
