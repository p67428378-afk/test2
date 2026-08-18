import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_URL = `${BASE_URL}/api/v1`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/categories", data);
  return response.data;
};

export const getExpenses = async (params = {}) => {
  const response = await api.get("/expenses", { params });
  return response.data;
};

export const getExpenseById = async (id) => {
  const response = await api.get(`/expenses/${id}`);
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export const getExpenseSummary = async (params = {}) => {
  const response = await api.get("/expenses/summary", { params });
  return response.data;
};

export default api;
