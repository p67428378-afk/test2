import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Bearer token to requests
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

// --- Auth APIs ---
export const loginUser = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", { email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
};

// --- Scheduling & Stage Allocation APIs ---
export const getPerformances = async (params = {}) => {
  const response = await api.get("/api/v1/performances", { params });
  return response.data;
};

export const schedulePerformance = async (data) => {
  const response = await api.post("/api/v1/performances", data);
  return response.data;
};

export const getArtists = async () => {
  const response = await api.get("/api/v1/artists");
  return response.data;
};

export const createArtist = async (data) => {
  const response = await api.post("/api/v1/artists", data);
  return response.data;
};

export const getStages = async () => {
  const response = await api.get("/api/v1/stages");
  return response.data;
};

export const createStage = async (data) => {
  const response = await api.post("/api/v1/stages", data);
  return response.data;
};

// --- Volunteer Roster & Shift APIs ---
export const getShifts = async (params = {}) => {
  const response = await api.get("/api/v1/volunteers/shifts", { params });
  return response.data;
};

export const checkInVolunteer = async (shiftId, volunteerId) => {
  const response = await api.post("/api/v1/volunteers/check-in", {
    shift_id: shiftId,
    volunteer_id: volunteerId,
  });
  return response.data;
};

export const createShift = async (data) => {
  const response = await api.post("/api/v1/volunteers/shifts", data);
  return response.data;
};

export const getVolunteers = async () => {
  const response = await api.get("/api/v1/volunteers");
  return response.data;
};

export const createVolunteer = async (data) => {
  const response = await api.post("/api/v1/volunteers", data);
  return response.data;
};

// --- Ticket Validation & Gate Entry APIs ---
export const validateTicket = async (
  ticketCode,
  qrPayload = "",
  gateName = "Main Gate",
) => {
  const response = await api.post("/api/v1/tickets/validate", {
    ticket_code: ticketCode,
    qr_payload: qrPayload,
    gate_name: gateName,
  });
  return response.data;
};

export const getTickets = async () => {
  const response = await api.get("/api/v1/tickets");
  return response.data;
};

export const createTicket = async (data) => {
  const response = await api.post("/api/v1/tickets", data);
  return response.data;
};

// --- Crowd Analytics & Telemetry APIs ---
export const getCrowdDensity = async () => {
  const response = await api.get("/api/v1/crowd/density");
  return response.data;
};

export const getTelemetryStreamUrl = () => {
  return `${BASE_URL}/api/v1/telemetry/stream`;
};

export default api;
