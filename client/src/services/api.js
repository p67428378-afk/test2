import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRules = async () => {
  const response = await api.get("/api/v1/rules");
  return response.data;
};

export const createRule = async (ruleData) => {
  const response = await api.post("/api/v1/rules", ruleData);
  return response.data;
};

export const updateRule = async (ruleId, ruleData) => {
  const response = await api.put(`/api/v1/rules/${ruleId}`, ruleData);
  return response.data;
};

export const getWorkflowDetails = async (ruleId) => {
  const response = await api.get(`/api/v1/workflows/${ruleId}`);
  return response.data;
};

export const pauseWorkflow = async (ruleId) => {
  const response = await api.post(`/api/v1/workflows/${ruleId}/pause`);
  return response.data;
};

export const approveWorkflow = async (ruleId) => {
  const response = await api.post(`/api/v1/workflows/${ruleId}/approve`);
  return response.data;
};

export const rejectWorkflow = async (ruleId) => {
  const response = await api.post(`/api/v1/workflows/${ruleId}/reject`);
  return response.data;
};

export const adjustWorkflow = async (ruleId, adjustData) => {
  const response = await api.post(
    `/api/v1/workflows/${ruleId}/adjust`,
    adjustData,
  );
  return response.data;
};

export default api;
