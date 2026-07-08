import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRoundupSettings = async () => {
  const response = await api.get("/api/v1/users/me/roundup-settings");
  return response.data;
};

export const updateRoundupSettings = async (is_roundup_enabled) => {
  const response = await api.put("/api/v1/users/me/roundup-settings", {
    is_roundup_enabled,
  });
  return response.data;
};

export const getRoundupSummary = async () => {
  const response = await api.get("/api/v1/roundups/summary");
  return response.data;
};

export const getTransactions = async (skip = 0, limit = 20) => {
  const response = await api.get("/api/v1/roundups/transactions", {
    params: { skip, limit },
  });
  return response.data;
};

export const triggerDailyJob = async () => {
  const response = await api.post("/api/v1/roundups/trigger-daily-job");
  return response.data;
};

export default api;
