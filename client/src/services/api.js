import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_role", response.data.role || "admin");
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
  },
  getToken: () => localStorage.getItem("token"),
  getRole: () => localStorage.getItem("user_role"),
  isAuthenticated: () => !!localStorage.getItem("token"),
};

export const publicFineService = {
  searchFines: async (licensePlate, ticketNumber) => {
    const params = {};
    if (licensePlate) params.license_plate = licensePlate;
    if (ticketNumber) params.ticket_number = ticketNumber;
    const response = await api.get("/api/v1/fines/search", { params });
    return response.data;
  },
  getFineStatus: async (fineId) => {
    const response = await api.get(`/api/v1/fines/${fineId}/status`);
    return response.data;
  },
};

export const adminFineService = {
  listFines: async (statusFilter, licensePlate) => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (licensePlate) params.license_plate = licensePlate;
    const response = await api.get("/api/v1/admin/fines", { params });
    return response.data;
  },
  createFine: async (fineData) => {
    const response = await api.post("/api/v1/admin/fines", fineData);
    return response.data;
  },
  updateFine: async (fineId, updateData) => {
    const response = await api.put(`/api/v1/admin/fines/${fineId}`, updateData);
    return response.data;
  },
  voidFine: async (fineId, notes) => {
    const response = await api.delete(`/api/v1/admin/fines/${fineId}`, {
      params: { notes },
    });
    return response.data;
  },
  listAuditLogs: async (fineId) => {
    const params = {};
    if (fineId) params.fine_id = fineId;
    const response = await api.get("/api/v1/admin/audit-logs", { params });
    return response.data;
  },
};

export default api;
