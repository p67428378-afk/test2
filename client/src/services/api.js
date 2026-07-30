import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
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
  (error) => Promise.reject(error),
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
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const userService = {
  listUsers: async () => {
    const response = await api.get("/api/v1/users");
    return response.data;
  },
  updateUser: async (userId, updateData) => {
    const response = await api.put(`/api/v1/users/${userId}`, updateData);
    return response.data;
  },
};

export const donationService = {
  createDonation: async (donationData) => {
    const response = await api.post("/api/v1/donations", donationData);
    return response.data;
  },
  listDonations: async (params = {}) => {
    const response = await api.get("/api/v1/donations", { params });
    return response.data;
  },
  getDonation: async (donationId) => {
    const response = await api.get(`/api/v1/donations/${donationId}`);
    return response.data;
  },
  requestDonation: async (donationId) => {
    const response = await api.post(`/api/v1/donations/${donationId}/request`);
    return response.data;
  },
};

export const deliveryService = {
  listDeliveries: async () => {
    const response = await api.get("/api/v1/deliveries");
    return response.data;
  },
  acceptDelivery: async (deliveryId) => {
    const response = await api.post(`/api/v1/deliveries/${deliveryId}/accept`);
    return response.data;
  },
  updateDeliveryStatus: async (deliveryId, status) => {
    const response = await api.put(`/api/v1/deliveries/${deliveryId}/status`, {
      status,
    });
    return response.data;
  },
};

export default api;
