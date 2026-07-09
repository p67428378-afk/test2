import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  signup: async (email, password, name) => {
    const response = await api.post("/api/v1/auth/signup", {
      email,
      password,
      name,
    });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_email", email);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  getUserEmail: () => {
    return localStorage.getItem("user_email") || "User";
  },
};

export const expenseService = {
  list: async (skip = 0, limit = 100) => {
    const response = await api.get("/api/v1/expenses", {
      params: { skip, limit },
    });
    return response.data;
  },
  create: async (expenseData) => {
    const response = await api.post("/api/v1/expenses", expenseData);
    return response.data;
  },
  update: async (id, expenseData) => {
    const response = await api.put(`/api/v1/expenses/${id}`, expenseData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/expenses/${id}`);
    return response.data;
  },
};

export default api;
