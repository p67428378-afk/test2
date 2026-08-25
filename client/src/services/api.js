import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const formatApiError = (error) => {
  if (error?.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (Array.isArray(detail)) {
      return detail
        .map((d) => d.msg || d.loc?.join(" ") || JSON.stringify(d))
        .join(", ");
    }
    return JSON.stringify(detail);
  }
  return error?.message || "An unexpected error occurred. Please try again.";
};

// Categories API
export const getCategories = async () => {
  const response = await apiClient.get("/api/v1/categories");
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await apiClient.post("/api/v1/categories", categoryData);
  return response.data;
};

export const getCategory = async (id) => {
  const response = await apiClient.get(`/api/v1/categories/${id}`);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(
    `/api/v1/categories/${id}`,
    categoryData,
  );
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/v1/categories/${id}`);
  return response.data;
};

// Expenses API
export const getExpenses = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      cleanParams[key] = params[key];
    }
  });
  const response = await apiClient.get("/api/v1/expenses", {
    params: cleanParams,
  });
  return response.data;
};

export const createExpense = async (expenseData) => {
  const response = await apiClient.post("/api/v1/expenses", expenseData);
  return response.data;
};

export const getExpense = async (id) => {
  const response = await apiClient.get(`/api/v1/expenses/${id}`);
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

// Budgets API
export const getBudgets = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      cleanParams[key] = params[key];
    }
  });
  const response = await apiClient.get("/api/v1/budgets", {
    params: cleanParams,
  });
  return response.data;
};

export const createOrUpdateBudget = async (budgetData) => {
  const response = await apiClient.post("/api/v1/budgets", budgetData);
  return response.data;
};

export const getBudget = async (id) => {
  const response = await apiClient.get(`/api/v1/budgets/${id}`);
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await apiClient.delete(`/api/v1/budgets/${id}`);
  return response.data;
};

// Analytics API
export const getAnalyticsSummary = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      cleanParams[key] = params[key];
    }
  });
  const response = await apiClient.get("/api/v1/analytics/summary", {
    params: cleanParams,
  });
  return response.data;
};

export const getCategoryBreakdown = async (params = {}) => {
  const cleanParams = {};
  Object.keys(params).forEach((key) => {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      cleanParams[key] = params[key];
    }
  });
  const response = await apiClient.get("/api/v1/analytics/category-breakdown", {
    params: cleanParams,
  });
  return response.data;
};

export const getMonthlyTrend = async (months = 6) => {
  const response = await apiClient.get("/api/v1/analytics/monthly-trend", {
    params: { months },
  });
  return response.data;
};
