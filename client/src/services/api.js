import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Critical for sending/receiving cookies (remember_me)
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

export const authService = {
  register: async (username, email, password) => {
    const response = await api.post("/api/v1/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  },
  login: async (username, password, rememberMe = false) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
      rememberMe,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post("/api/v1/auth/refresh-token");
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const hiveService = {
  getHives: async () => {
    const response = await api.get("/api/v1/hives");
    return response.data;
  },
  createHive: async (hiveData) => {
    const response = await api.post("/api/v1/hives", hiveData);
    return response.data;
  },
  getHiveDetail: async (hiveId) => {
    const response = await api.get(`/api/v1/hives/${hiveId}`);
    return response.data;
  },
  postSensorData: async (hiveId, sensorData) => {
    const response = await api.post(
      `/api/v1/hives/${hiveId}/sensor-data`,
      sensorData,
    );
    return response.data;
  },
  createProductionLog: async (hiveId, logData) => {
    const response = await api.post(
      `/api/v1/hives/${hiveId}/production-logs`,
      logData,
    );
    return response.data;
  },
  createPopulationLog: async (hiveId, logData) => {
    const response = await api.post(
      `/api/v1/hives/${hiveId}/population-logs`,
      logData,
    );
    return response.data;
  },
  createInspection: async (hiveId, inspectionData) => {
    const response = await api.post(
      `/api/v1/hives/${hiveId}/inspections`,
      inspectionData,
    );
    return response.data;
  },
  createDiseaseReport: async (hiveId, reportData) => {
    const response = await api.post(
      `/api/v1/hives/${hiveId}/disease-reports`,
      reportData,
    );
    return response.data;
  },
};

export default api;
