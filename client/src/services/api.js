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

export const itemService = {
  createItem: async (itemData) => {
    const response = await api.post("/api/v1/items", itemData);
    return response.data;
  },
  getFoundItems: async (params = {}) => {
    const response = await api.get("/api/v1/items/found", { params });
    return response.data;
  },
  getLostItemMatches: async (itemId) => {
    const response = await api.get(`/api/v1/items/lost/${itemId}/matches`);
    return response.data;
  },
};

export const claimService = {
  createClaim: async (claimData) => {
    const response = await api.post("/api/v1/claims", claimData);
    return response.data;
  },
};

export const adminService = {
  getAllClaims: async (params = {}) => {
    const response = await api.get("/api/v1/admin/claims", { params });
    return response.data;
  },
  updateClaimStatus: async (claimId, status) => {
    const response = await api.put(`/api/v1/admin/claims/${claimId}`, {
      status,
    });
    return response.data;
  },
  getAllItems: async (params = {}) => {
    const response = await api.get("/api/v1/admin/items", { params });
    return response.data;
  },
  getAllUsers: async (params = {}) => {
    const response = await api.get("/api/v1/admin/users", { params });
    return response.data;
  },
};

export default api;
