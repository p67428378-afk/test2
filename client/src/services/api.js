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

export const authService = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    const response = await api.post("/api/v1/auth/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.data.access_token) {
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

export const itemService = {
  getItems: async (params = {}) => {
    const response = await api.get("/api/v1/items", { params });
    return response.data;
  },

  getItemById: async (itemId) => {
    const response = await api.get(`/api/v1/items/${itemId}`);
    return response.data;
  },

  reportItem: async (itemData) => {
    const response = await api.post("/api/v1/items", itemData);
    return response.data;
  },

  getItemMatches: async (itemId, threshold = 60) => {
    const response = await api.get(`/api/v1/items/${itemId}/matches`, {
      params: { threshold },
    });
    return response.data;
  },
};

export const claimService = {
  submitClaim: async (claimData) => {
    const response = await api.post("/api/v1/claims", claimData);
    return response.data;
  },

  getAdminClaims: async (params = {}) => {
    try {
      const response = await api.get("/api/v1/admin/claims", { params });
      return response.data;
    } catch (e) {
      const response = await api.get("/admin/claims", { params });
      return response.data;
    }
  },

  verifyClaim: async (claimId, verifyData) => {
    try {
      const response = await api.post(
        `/api/v1/admin/claims/${claimId}/verify`,
        verifyData,
      );
      return response.data;
    } catch (e) {
      const response = await api.post(
        `/admin/claims/${claimId}/verify`,
        verifyData,
      );
      return response.data;
    }
  },

  getItemHistory: async (itemId) => {
    try {
      const response = await api.get(`/api/v1/admin/items/${itemId}/history`);
      return response.data;
    } catch (e) {
      const response = await api.get(`/admin/items/${itemId}/history`);
      return response.data;
    }
  },
};

export default api;
