import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const updateInmate = async (id, data) => {
  const response = await api.patch(`/api/v1/inmates/${id}`, data);
  return response.data;
};

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

export const createVerification = async (data) => {
  const response = await api.post("/api/v1/verifications", data);
  return response.data;
};

export const listVerifications = async (params = {}) => {
  const response = await api.get("/api/v1/verifications", { params });
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

export default api;
