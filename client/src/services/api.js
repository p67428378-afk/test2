import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("parent_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("parent_token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("parent_token");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("parent_token");
  },
};

export const learningService = {
  getItems: async () => {
    const response = await api.get("/api/v1/learning-items");
    return response.data;
  },
};

export const progressService = {
  logProgress: async (learningItemId) => {
    const response = await api.post("/api/v1/progress", {
      learning_item_id: learningItemId,
    });
    return response.data;
  },
  getProgress: async () => {
    const response = await api.get("/api/v1/progress");
    return response.data;
  },
  resetProgress: async () => {
    const response = await api.post("/api/v1/progress/reset");
    return response.data;
  },
};

export default api;
