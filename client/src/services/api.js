import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

const apiClient = axios.create({
  baseURL: `${BASE_URL}${API_PREFIX}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add Authorization Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    if (response.data?.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_info");
  },
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user_info");
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },
};

export const campaignsAPI = {
  getCampaigns: async (params = {}) => {
    const response = await apiClient.get("/campaigns", { params });
    return response.data;
  },
  getCampaign: async (id) => {
    const response = await apiClient.get(`/campaigns/${id}`);
    return response.data;
  },
  createCampaign: async (data) => {
    const response = await apiClient.post("/campaigns", data);
    return response.data;
  },
  updateCampaign: async (id, data) => {
    const response = await apiClient.put(`/campaigns/${id}`, data);
    return response.data;
  },
  deleteCampaign: async (id) => {
    const response = await apiClient.delete(`/campaigns/${id}`);
    return response.data;
  },
};

export const donationsAPI = {
  createDonation: async (data) => {
    const response = await apiClient.post("/donations", data);
    return response.data;
  },
  getDonations: async (params = {}) => {
    if (params.export_csv) {
      const response = await apiClient.get("/donations", {
        params,
        responseType: "blob",
      });
      return response.data;
    }
    const response = await apiClient.get("/donations", { params });
    return response.data;
  },
  getMyDonations: async (params = {}) => {
    const response = await apiClient.get("/donations/my-donations", { params });
    return response.data;
  },
};

export default apiClient;
