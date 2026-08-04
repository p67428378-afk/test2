import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchKPIs = async (clusterId = "small-town-value") => {
  const response = await api.get("/api/v1/assortment/kpis", {
    params: { cluster_id: clusterId },
  });
  return response.data;
};

export const fetchSKUs = async (
  clusterId = "small-town-value",
  category = "Snacks",
) => {
  const response = await api.get("/api/v1/assortment/skus", {
    params: { cluster_id: clusterId, category },
  });
  return response.data;
};

export const fetchScenarios = async () => {
  const response = await api.get("/api/v1/assortment/scenarios");
  return response.data;
};

export const submitRecommendation = async (payload) => {
  const response = await api.post("/api/v1/assortment/submit", payload);
  return response.data;
};

export default api;
