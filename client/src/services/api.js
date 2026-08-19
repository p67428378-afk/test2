import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Auth Services
export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post("/api/v1/auth/login", {
      email,
      password,
    });
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post("/api/v1/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/api/v1/auth/me");
    return response.data;
  },
};

// Conference Services
export const conferenceApi = {
  createConference: async (data) => {
    const response = await apiClient.post("/api/v1/conferences", data);
    return response.data;
  },
  listConferences: async (status = null) => {
    const params = status ? { status } : {};
    const response = await apiClient.get("/api/v1/conferences", { params });
    return response.data;
  },
  getConference: async (id) => {
    const response = await apiClient.get(`/api/v1/conferences/${id}`);
    return response.data;
  },
};

// Session Services
export const sessionApi = {
  createSession: async (data) => {
    const response = await apiClient.post("/api/v1/sessions", data);
    return response.data;
  },
  listSessions: async (conferenceId = null, status = null) => {
    const params = {};
    if (conferenceId) params.conference_id = conferenceId;
    if (status) params.status = status;
    const response = await apiClient.get("/api/v1/sessions", { params });
    return response.data;
  },
  getSession: async (id) => {
    const response = await apiClient.get(`/api/v1/sessions/${id}`);
    return response.data;
  },
};

// Review Services
export const reviewApi = {
  submitReview: async (data) => {
    const response = await apiClient.post("/api/v1/reviews", data);
    return response.data;
  },
  getSessionReviews: async (sessionId) => {
    const response = await apiClient.get(
      `/api/v1/reviews/session/${sessionId}`,
    );
    return response.data;
  },
};

// Registration Services
export const registrationApi = {
  registerConference: async (data) => {
    const response = await apiClient.post("/api/v1/registrations", data);
    return response.data;
  },
  getUserRegistrations: async (userId) => {
    const response = await apiClient.get(
      `/api/v1/registrations/user/${userId}`,
    );
    return response.data;
  },
  listRegistrations: async (conferenceId = null) => {
    const params = conferenceId ? { conference_id: conferenceId } : {};
    const response = await apiClient.get("/api/v1/registrations", { params });
    return response.data;
  },
};

// Schedule Services
export const scheduleApi = {
  publishSchedule: async (data) => {
    const response = await apiClient.post("/api/v1/schedules/publish", data);
    return response.data;
  },
  getConferenceSchedule: async (conferenceId) => {
    const response = await apiClient.get(
      `/api/v1/schedules/conference/${conferenceId}`,
    );
    return response.data;
  },
};

// Attendance Services
export const attendanceApi = {
  checkInAttendee: async (data) => {
    const response = await apiClient.post("/api/v1/attendance/check-in", data);
    return response.data;
  },
  getSessionAttendance: async (sessionId) => {
    const response = await apiClient.get(
      `/api/v1/attendance/session/${sessionId}`,
    );
    return response.data;
  },
};
