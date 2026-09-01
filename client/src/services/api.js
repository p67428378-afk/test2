import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication
export const loginUser = async (data) => {
  const response = await api.post("/api/v1/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await api.post("/api/v1/auth/register", data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
};

// Visitors
export const registerVisitor = async (data) => {
  const response = await api.post("/api/v1/visitors/register", data);
  return response.data;
};

export const getVisitorProfile = async (params = {}) => {
  const response = await api.get("/api/v1/visitors/profile", { params });
  return response.data;
};

export const listVisitors = async (params = {}) => {
  const response = await api.get("/api/v1/visitors", { params });
  return response.data;
};

export const getVisitorById = async (id) => {
  const response = await api.get(`/api/v1/visitors/${id}`);
  return response.data;
};

export const getVisitorHistory = async (id) => {
  const response = await api.get(`/api/v1/visitors/${id}/history`);
  return response.data;
};

// Inmates
export const listInmates = async (params = {}) => {
  const response = await api.get("/api/v1/inmates", { params });
  return response.data;
};

export const createInmate = async (data) => {
  const response = await api.post("/api/v1/inmates", data);
  return response.data;
};

export const getInmateById = async (id) => {
  const response = await api.get(`/api/v1/inmates/${id}`);
  return response.data;
};

// Appointments
export const createAppointment = async (data) => {
  const response = await api.post("/api/v1/appointments", data);
  return response.data;
};

export const listAppointments = async (params = {}) => {
  const response = await api.get("/api/v1/appointments", { params });
  return response.data;
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/api/v1/appointments/${id}`);
  return response.data;
};

export const updateAppointmentStatus = async (id, data) => {
  const response = await api.patch(`/api/v1/appointments/${id}/status`, data);
  return response.data;
};

export const generateDigitalPass = async (appointmentId) => {
  const response = await api.post(
    `/api/v1/appointments/${appointmentId}/digital-pass`,
  );
  return response.data;
};

export const downloadDigitalPassPdf = async (appointmentId) => {
  const response = await api.get(
    `/api/v1/appointments/${appointmentId}/digital-pass/pdf`,
  );
  return response.data;
};

// Express Gate Control
export const scanQRPass = async (data) => {
  const response = await api.post("/api/v1/gate/scan-qr", data);
  return response.data;
};

export const checkInVisitor = async (data) => {
  const response = await api.post("/api/v1/entry-exit-logs/check-in", data);
  return response.data;
};

export const checkOutVisitor = async (data) => {
  const response = await api.post("/api/v1/entry-exit-logs/check-out", data);
  return response.data;
};

export const listEntryExitLogs = async (params = {}) => {
  const response = await api.get("/api/v1/entry-exit-logs", { params });
  return response.data;
};

// Security Watchlist
export const listWatchlist = async (params = {}) => {
  const response = await api.get("/api/v1/watchlist", { params });
  return response.data;
};

export const addToWatchlist = async (data) => {
  const response = await api.post("/api/v1/watchlist", data);
  return response.data;
};

export const screenVisitorWatchlist = async (data) => {
  const response = await api.post("/api/v1/watchlist/screen", data);
  return response.data;
};

export const removeFromWatchlist = async (entryId) => {
  const response = await api.delete(`/api/v1/watchlist/${entryId}`);
  return response.data;
};

// Identity Verifications
export const createVerification = async (data) => {
  const response = await api.post("/api/v1/verifications", data);
  return response.data;
};

export const listVerifications = async (params = {}) => {
  const response = await api.get("/api/v1/verifications", { params });
  return response.data;
};

export default api;
