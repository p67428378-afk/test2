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

export const authApi = {
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
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

export const donationApi = {
  getDonations: async (params = {}) => {
    const response = await api.get("/api/v1/donations", { params });
    return response.data;
  },
  createDonation: async (donationData) => {
    const response = await api.post("/api/v1/donations", donationData);
    return response.data;
  },
  updateFreshness: async (id, freshnessStatus) => {
    const response = await api.patch(`/api/v1/donations/${id}/freshness`, {
      freshness_status: freshnessStatus,
    });
    return response.data;
  },
};

export const claimApi = {
  getClaims: async (params = {}) => {
    const response = await api.get("/api/v1/claims", { params });
    return response.data;
  },
  createClaim: async (claimData) => {
    const response = await api.post("/api/v1/claims", claimData);
    return response.data;
  },
};

export const deliveryApi = {
  getDeliveries: async (params = {}) => {
    const response = await api.get("/api/v1/deliveries", { params });
    return response.data;
  },
  updateDeliveryStatus: async (id, statusData) => {
    const response = await api.patch(
      `/api/v1/deliveries/${id}/status`,
      statusData,
    );
    return response.data;
  },
};

export const adminApi = {
  getAnalytics: async () => {
    const response = await api.get("/api/v1/admin/analytics");
    return response.data;
  },
  getAuditLogs: async (params = {}) => {
    const response = await api.get("/api/v1/admin/audit-logs", { params });
    return response.data;
  },
};

export default api;
