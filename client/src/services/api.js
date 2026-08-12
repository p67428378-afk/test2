import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for optional token
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

export const clockService = {
  getServerTime: async (tz = null) => {
    const params = tz ? { tz } : {};
    const response = await api.get("/api/v1/time", { params });
    return response.data;
  },
};

export const alarmService = {
  getAlarms: async () => {
    const response = await api.get("/api/v1/alarms");
    return response.data;
  },
  createAlarm: async (alarmData) => {
    const response = await api.post("/api/v1/alarms", alarmData);
    return response.data;
  },
  updateAlarm: async (alarmId, alarmData) => {
    const response = await api.put(`/api/v1/alarms/${alarmId}`, alarmData);
    return response.data;
  },
  deleteAlarm: async (alarmId) => {
    const response = await api.delete(`/api/v1/alarms/${alarmId}`);
    return response.data;
  },
};

export const settingsService = {
  getSettings: async () => {
    const response = await api.get("/api/v1/settings");
    return response.data;
  },
  updateSettings: async (settingsData) => {
    const response = await api.put("/api/v1/settings", settingsData);
    return response.data;
  },
};

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};

export default api;
