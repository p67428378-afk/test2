import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Authorization Bearer token if present
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

// Auth Service
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", {
      username: email,
      password,
    });
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  getStoredUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
};

// Contracts Service
export const contractService = {
  list: async (params = {}) => {
    const response = await api.get("/api/v1/contracts", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/v1/contracts/${id}`);
    return response.data;
  },
  create: async (contractData) => {
    const response = await api.post("/api/v1/contracts", contractData);
    return response.data;
  },
  update: async (id, updateData) => {
    const response = await api.put(`/api/v1/contracts/${id}`, updateData);
    return response.data;
  },
  getVersions: async (id) => {
    const response = await api.get(`/api/v1/contracts/${id}/versions`);
    return response.data;
  },
};

// Comments Service
export const commentService = {
  getComments: async (contractId) => {
    const response = await api.get(`/api/v1/contracts/${contractId}/comments`);
    return response.data;
  },
  addComment: async (contractId, commentData) => {
    const response = await api.post(
      `/api/v1/contracts/${contractId}/comments`,
      commentData,
    );
    return response.data;
  },
};

// Approvals & Workflow Service
export const approvalService = {
  submitAction: async (contractId, actionData) => {
    const response = await api.post(
      `/api/v1/contracts/${contractId}/approvals`,
      actionData,
    );
    return response.data;
  },
  getWorkflowHistory: async (contractId) => {
    const response = await api.get(`/api/v1/contracts/${contractId}/approvals`);
    return response.data;
  },
};

// Reminders Service
export const reminderService = {
  list: async () => {
    const response = await api.get("/api/v1/reminders");
    return response.data;
  },
  process: async () => {
    const response = await api.post("/api/v1/reminders/process");
    return response.data;
  },
};

export default api;
