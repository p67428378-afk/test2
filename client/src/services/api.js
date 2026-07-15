import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token if present
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
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    return response.data;
  },
};

export const appointmentService = {
  create: async (appointmentData) => {
    const response = await api.post("/api/v1/appointments", appointmentData);
    return response.data;
  },
  getPending: async () => {
    const response = await api.get("/api/v1/appointments/pending");
    return response.data;
  },
  approveOrDeny: async (appointmentId, status, denialReason = null) => {
    const response = await api.put(
      `/api/v1/appointments/${appointmentId}/approve`,
      {
        status,
        denial_reason: denialReason,
      },
    );
    return response.data;
  },
};

export const visitService = {
  checkIn: async (appointmentId) => {
    const response = await api.post("/api/v1/visits/check-in", {
      appointment_id: appointmentId,
    });
    return response.data;
  },
  checkOut: async (visitLogId) => {
    const response = await api.post("/api/v1/visits/check-out", {
      visit_log_id: visitLogId,
    });
    return response.data;
  },
  getHistory: async (inmateId) => {
    const response = await api.get(`/api/v1/visits/history/${inmateId}`);
    return response.data;
  },
};

export const securityService = {
  flagVisitor: async (visitorId, reason) => {
    const response = await api.post("/api/v1/security/flag", {
      visitor_id: visitorId,
      reason,
    });
    return response.data;
  },
};

export default api;
