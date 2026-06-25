import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAccounts = async () => {
  const response = await api.get("/api/v1/accounts");
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await api.post("/api/v1/accounts", accountData);
  return response.data;
};

export const getSweepRules = async () => {
  const response = await api.get("/api/v1/sweep-rules");
  return response.data;
};

export const createSweepRule = async (ruleData) => {
  const response = await api.post("/api/v1/sweep-rules", ruleData);
  return response.data;
};

export const updateSweepRule = async (id, ruleData) => {
  const response = await api.put(`/api/v1/sweep-rules/${id}`, ruleData);
  return response.data;
};

export const deleteSweepRule = async (id) => {
  const response = await api.delete(`/api/v1/sweep-rules/${id}`);
  return response.data;
};

export const getHedgeRules = async () => {
  const response = await api.get("/api/v1/hedge-rules");
  return response.data;
};

export const createHedgeRule = async (ruleData) => {
  const response = await api.post("/api/v1/hedge-rules", ruleData);
  return response.data;
};

export const updateHedgeRule = async (id, ruleData) => {
  const response = await api.put(`/api/v1/hedge-rules/${id}`, ruleData);
  return response.data;
};

export const deleteHedgeRule = async (id) => {
  const response = await api.delete(`/api/v1/hedge-rules/${id}`);
  return response.data;
};

export const getActivityLogs = async (params = {}) => {
  const response = await api.get("/api/v1/activity-logs", { params });
  return response.data;
};

export const triggerSweep = async (payload = {}) => {
  const response = await api.post("/api/v1/sweeps/trigger", payload);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/api/v1/dashboard/stats");
  return response.data;
};

export const getDashboardCharts = async () => {
  const response = await api.get("/api/v1/dashboard/charts");
  return response.data;
};

export default api;
