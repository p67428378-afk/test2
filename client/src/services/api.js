import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
};

export const packageService = {
  getPackages: async (params = {}) => {
    const response = await api.get("/api/v1/packages", { params });
    return response.data;
  },
  getPackage: async (packageId) => {
    const response = await api.get(`/api/v1/packages/${packageId}`);
    return response.data;
  },
};

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post("/api/v1/bookings", bookingData);
    return response.data;
  },
  getBooking: async (bookingId) => {
    const response = await api.get(`/api/v1/bookings/${bookingId}`);
    return response.data;
  },
  getUserBookings: async () => {
    const response = await api.get("/api/v1/users/me/bookings");
    return response.data;
  },
};

export const paymentService = {
  processPayment: async (paymentData) => {
    const response = await api.post("/api/v1/payments", paymentData);
    return response.data;
  },
};

export default api;
