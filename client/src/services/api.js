import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const eventService = {
  getEvents: async (params = {}) => {
    const response = await api.get("/api/v1/events", { params });
    return response.data;
  },
  getEvent: async (eventId) => {
    const response = await api.get(`/api/v1/events/${eventId}`);
    return response.data;
  },
  createEvent: async (eventData) => {
    const response = await api.post("/api/v1/events", eventData);
    return response.data;
  },
  registerForEvent: async (eventId, registrationData) => {
    const response = await api.post(
      `/api/v1/events/${eventId}/register`,
      registrationData,
    );
    return response.data;
  },
};

export const adminService = {
  login: async (username, password) => {
    const response = await api.post("/api/v1/admin/login", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("admin_token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("admin_token");
  },
  getReports: async () => {
    const response = await api.get("/api/v1/admin/reports");
    return response.data;
  },
};

export default api;
