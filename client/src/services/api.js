import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },
  register: async (email, password, role = "user") => {
    const response = await apiClient.post("/api/v1/auth/register", {
      email,
      password,
      role,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getToken: () => localStorage.getItem("token"),
  getUser: () => {
    const userStr = localStorage.getItem("user");
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
};

export const expenseApi = {
  getExpenses: async (params = {}) => {
    const response = await apiClient.get("/api/v1/expenses", { params });
    return response.data;
  },
  createExpense: async (data) => {
    const response = await apiClient.post("/api/v1/expenses", data);
    return response.data;
  },
  getExpense: async (id) => {
    const response = await apiClient.get(`/api/v1/expenses/${id}`);
    return response.data;
  },
  updateExpense: async (id, data) => {
    const response = await apiClient.put(`/api/v1/expenses/${id}`, data);
    return response.data;
  },
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/api/v1/expenses/${id}`);
    return response.data;
  },
};

export const categoryApi = {
  getCategories: async (type) => {
    const params = type ? { type } : {};
    const response = await apiClient.get("/api/v1/categories", { params });
    return response.data;
  },
  createCategory: async (data) => {
    const response = await apiClient.post("/api/v1/categories", data);
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await apiClient.put(`/api/v1/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/api/v1/categories/${id}`);
    return response.data;
  },
};

export const budgetApi = {
  getBudgets: async (month) => {
    const params = month ? { month } : {};
    const response = await apiClient.get("/api/v1/budgets", { params });
    return response.data;
  },
  setBudget: async (data) => {
    const response = await apiClient.post("/api/v1/budgets", data);
    return response.data;
  },
  deleteBudget: async (id) => {
    const response = await apiClient.delete(`/api/v1/budgets/${id}`);
    return response.data;
  },
};

export const reportApi = {
  getSummary: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await apiClient.get("/api/v1/reports/summary", { params });
    return response.data;
  },
  exportReport: async (format = "csv", startDate, endDate) => {
    const params = { format };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    const response = await apiClient.get("/api/v1/reports/export", {
      params,
      responseType: "blob",
    });
    return response;
  },
};

export default {
  auth: authApi,
  expenses: expenseApi,
  categories: categoryApi,
  budgets: budgetApi,
  reports: reportApi,
};
