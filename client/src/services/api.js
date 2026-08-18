import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if unauthorized/expired
      if (localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("auth-expired"));
      }
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: async (userData) => {
    const res = await api.post("/api/v1/auth/register", userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await api.post("/api/v1/auth/login", credentials);
    if (res.data && res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/api/v1/auth/me");
    return res.data;
  },
  getGuides: async () => {
    const res = await api.get("/api/v1/auth/guides");
    return res.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export const toursAPI = {
  listTours: async (params = {}) => {
    const res = await api.get("/api/v1/tours", { params });
    return res.data;
  },
  getTour: async (id) => {
    const res = await api.get(`/api/v1/tours/${id}`);
    return res.data;
  },
  createTour: async (data) => {
    const res = await api.post("/api/v1/tours", data);
    return res.data;
  },
  updateTour: async (id, data) => {
    const res = await api.put(`/api/v1/tours/${id}`, data);
    return res.data;
  },
  deleteTour: async (id) => {
    const res = await api.delete(`/api/v1/tours/${id}`);
    return res.data;
  },
};

export const schedulesAPI = {
  listSchedules: async (params = {}) => {
    const res = await api.get("/api/v1/schedules", { params });
    return res.data;
  },
  getSchedule: async (id) => {
    const res = await api.get(`/api/v1/schedules/${id}`);
    return res.data;
  },
  createSchedule: async (data) => {
    const res = await api.post("/api/v1/schedules", data);
    return res.data;
  },
  updateSchedule: async (id, data) => {
    const res = await api.put(`/api/v1/schedules/${id}`, data);
    return res.data;
  },
  deleteSchedule: async (id) => {
    const res = await api.delete(`/api/v1/schedules/${id}`);
    return res.data;
  },
};

export const bookingsAPI = {
  createBooking: async (data) => {
    const res = await api.post("/api/v1/bookings", data);
    return res.data;
  },
  getMyBookings: async () => {
    const res = await api.get("/api/v1/bookings/my-bookings");
    return res.data;
  },
  listAllBookings: async (params = {}) => {
    const res = await api.get("/api/v1/bookings", { params });
    return res.data;
  },
  getBooking: async (id) => {
    const res = await api.get(`/api/v1/bookings/${id}`);
    return res.data;
  },
  cancelBooking: async (id) => {
    const res = await api.post(`/api/v1/bookings/${id}/cancel`);
    return res.data;
  },
  deleteBooking: async (id) => {
    const res = await api.delete(`/api/v1/bookings/${id}`);
    return res.data;
  },
};

export const attendanceAPI = {
  getAttendanceSheet: async (scheduleId) => {
    const res = await api.get(`/api/v1/attendance/schedule/${scheduleId}`);
    return res.data;
  },
  checkInVisitor: async (data) => {
    const res = await api.post("/api/v1/attendance/check-in", data);
    return res.data;
  },
};

export default api;
