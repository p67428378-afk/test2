import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboardData = async () => {
  const response = await api.get("/api/v1/dashboard");
  return response.data;
};

export const submitProposal = async (scenarioId, proposedActions) => {
  const response = await api.post("/api/v1/proposals", {
    scenario_id: scenarioId,
    proposed_actions: proposedActions,
  });
  return response.data;
};

export default api;
