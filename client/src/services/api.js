import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  signup: async (email, password) => {
    const response = await api.post("/api/v1/auth/signup", { email, password });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const taskService = {
  getTasks: async (params = {}) => {
    const response = await api.get("/api/v1/tasks", { params });
    return response.data;
  },
  getTask: async (id) => {
    const response = await api.get(`/api/v1/tasks/${id}`);
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post("/api/v1/tasks", taskData);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/api/v1/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/api/v1/tasks/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getStats: async () => {
    const response = await api.get("/api/v1/dashboard/stats");
    return response.data;
  },
};

export default api;
