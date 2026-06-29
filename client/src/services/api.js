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

export const getSkus = async (params = {}) => {
  const response = await api.get("/api/v1/skus", { params });
  return response.data;
};

export const getScenario = async (scenarioName) => {
  const response = await api.get(
    `/api/v1/scenarios/${scenarioName.toLowerCase()}`,
  );
  return response.data;
};

export const submitApproval = async (scenarioName, submittedBy) => {
  const response = await api.post("/api/v1/approvals", {
    scenario_name: scenarioName,
    submitted_by: submittedBy,
  });
  return response.data;
};

export default {
  getKpis,
  getSkus,
  getScenario,
  submitApproval,
};
