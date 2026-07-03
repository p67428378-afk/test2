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
  (error) => Promise.reject(error),
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (email, password, role = "member") => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      role,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const taskService = {
  getTasks: async (filters = {}) => {
    const params = {};
    if (filters.assignee_id) params.assignee_id = filters.assignee_id;
    if (filters.priority) params.priority = filters.priority;
    if (filters.status) params.status_filter = filters.status; // backend uses status_filter

    const response = await api.get("/api/v1/tasks", { params });
    return response.data;
  },

  getTask: async (taskId) => {
    const response = await api.get(`/api/v1/tasks/${taskId}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/api/v1/tasks", taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/api/v1/tasks/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/api/v1/tasks/${taskId}`);
    return response.data;
  },

  triggerReminders: async () => {
    const response = await api.post("/api/v1/tasks/reminders/trigger");
    return response.data;
  },
};

export const reportService = {
  getDashboardMetrics: async () => {
    const response = await api.get("/api/v1/reports/dashboard");
    return response.data;
  },
};

export default api;
