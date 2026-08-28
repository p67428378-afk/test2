import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Health
  checkHealth: async () => {
    const response = await apiClient.get("/api/v1/health");
    return response.data;
  },

  // Users
  getUsers: async (role = null) => {
    const params = {};
    if (role) params.role = role;
    const response = await apiClient.get("/api/v1/users", { params });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await apiClient.get(`/api/v1/users/${userId}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await apiClient.post("/api/v1/users", userData);
    return response.data;
  },

  // Balances
  getLeaveBalances: async (userId, year = 2026) => {
    const response = await apiClient.get(`/api/v1/balances/${userId}`, {
      params: { year },
    });
    return response.data;
  },

  // Leaves
  getLeaveRequests: async (params = {}) => {
    const response = await apiClient.get("/api/v1/leaves", { params });
    return response.data;
  },

  getLeaveRequest: async (id) => {
    const response = await apiClient.get(`/api/v1/leaves/${id}`);
    return response.data;
  },

  submitLeaveRequest: async (leaveData) => {
    const response = await apiClient.post("/api/v1/leaves", leaveData);
    return response.data;
  },

  updateLeaveStatus: async (id, statusData) => {
    const response = await apiClient.patch(
      `/api/v1/leaves/${id}/status`,
      statusData,
    );
    return response.data;
  },
};

export default api;
