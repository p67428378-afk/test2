import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token
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

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
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
};

export const habitsService = {
  getHabits: async (tz = "UTC") => {
    const response = await api.get(
      `/api/v1/habits?tz=${encodeURIComponent(tz)}`,
    );
    return response.data;
  },
  completeHabit: async (habitId, tz = "UTC") => {
    const response = await api.post(
      `/api/v1/habits/${habitId}/complete?tz=${encodeURIComponent(tz)}`,
    );
    return response.data;
  },
};

export const parentService = {
  getHabitsAll: async () => {
    const response = await api.get("/api/v1/parent/habits");
    return response.data;
  },
  getProgress: async (tz = "UTC") => {
    const response = await api.get(
      `/api/v1/parent/progress?tz=${encodeURIComponent(tz)}`,
    );
    return response.data;
  },
  toggleHabit: async (habitId, isActive) => {
    const response = await api.post(`/api/v1/parent/habits/${habitId}/toggle`, {
      is_active: isActive,
    });
    return response.data;
  },
  resetProgress: async (childId) => {
    const response = await api.post(`/api/v1/parent/progress/${childId}/reset`);
    return response.data;
  },
};

export default api;
