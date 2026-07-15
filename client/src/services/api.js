import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getKPIMetrics = async () => {
  const response = await apiClient.get("/api/v1/kpis/snacks/small-town-value");
  return response.data;
};

export const getSKUPerformance = async () => {
  const response = await apiClient.get("/api/v1/skus/performance", {
    params: {
      category: "snacks",
      cluster: "small-town-value",
    },
  });
  return response.data;
};

export const submitAssortmentPlan = async (scenarioSelected, skuActions) => {
  const response = await apiClient.post("/api/v1/assortment/submit", {
    scenario_selected: scenarioSelected,
    sku_actions: skuActions,
  });
  return response.data;
};
