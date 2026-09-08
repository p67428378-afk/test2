import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getExpenses = async (params = {}) => {
  const response = await apiClient.get("/api/v1/expenses", { params });
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await apiClient.get(`/api/v1/expenses/${id}`);
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await apiClient.post("/api/v1/expenses", expenseData);
  return response.data;
};

export const updateExpense = async (id, expenseData) => {
  const response = await apiClient.put(`/api/v1/expenses/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await apiClient.delete(`/api/v1/expenses/${id}`);
  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await apiClient.get("/api/v1/dashboard/summary");
  return response.data;
};

export default apiClient;
