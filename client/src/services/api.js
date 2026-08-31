import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGroups = async (params = {}) => {
  const response = await apiClient.get("/api/v1/groups", { params });
  return response.data;
};

export const getGroup = async (groupId) => {
  const response = await apiClient.get(`/api/v1/groups/${groupId}`);
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await apiClient.post("/api/v1/groups", groupData);
  return response.data;
};

export const getExpenses = async (params = {}) => {
  const response = await apiClient.get("/api/v1/expenses", { params });
  return response.data;
};

export const getExpense = async (expenseId) => {
  const response = await apiClient.get(`/api/v1/expenses/${expenseId}`);
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await apiClient.post("/api/v1/expenses", expenseData);
  return response.data;
};

export const getGroupSettlements = async (groupId) => {
  const response = await apiClient.get(`/api/v1/groups/${groupId}/settlements`);
  return response.data;
};

export const getHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

export default apiClient;
