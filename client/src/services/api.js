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
  login: async (username, password) => {
    const response = await api.post("/api/v1/auth/token", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role || "owner");
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
  getMe: async () => {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  },
};

export const systemService = {
  getRealtime: async (systemId) => {
    const response = await api.get(`/api/v1/systems/${systemId}/realtime`);
    return response.data;
  },
  getAnalytics: async (systemId, period = "daily") => {
    const response = await api.get(`/api/v1/systems/${systemId}/analytics`, {
      params: { period },
    });
    return response.data;
  },
};

export const alertService = {
  getAlerts: async () => {
    const response = await api.get("/api/v1/alerts");
    return response.data;
  },
};

export const serviceRequestService = {
  getRequests: async () => {
    const response = await api.get("/api/v1/service-requests");
    return response.data;
  },
  updateRequest: async (requestId, status, notes = "") => {
    const response = await api.put(`/api/v1/service-requests/${requestId}`, {
      status,
      notes,
    });
    return response.data;
  },
};

export default api;
