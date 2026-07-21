import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to inject JWT token
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
  login: async (username, password) => {
    const response = await api.post("/api/v1/auth/token", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
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

export const worklistService = {
  getWorklist: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/worklist", {
      params: { skip, limit },
    });
    return response.data;
  },
  createTask: async (name, status = "To Do", dueDate = null) => {
    const response = await api.post("/api/v1/worklist", {
      name,
      status,
      due_date: dueDate,
    });
    return response.data;
  },
  updateTaskStatus: async (taskId, status) => {
    const response = await api.put(`/api/v1/worklist/${taskId}`, {
      status,
    });
    return response.data;
  },
};

export const getWebSocketUrl = () => {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  // If BASE_URL is relative or localhost, construct appropriate WS URL
  if (BASE_URL.startsWith("http")) {
    const url = new URL(BASE_URL);
    return `${url.protocol === "https:" ? "wss:" : "ws:"}//${url.host}/ws/worklist`;
  }
  return `${wsProtocol}//${window.location.host}/ws/worklist`;
};

export default api;
