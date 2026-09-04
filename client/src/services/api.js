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

export const submitFeedback = async (payload) => {
  const response = await api.post("/api/v1/feedback", payload);
  return response.data;
};

export const getFeedbackById = async (feedbackId) => {
  const response = await api.get(`/api/v1/feedback/${feedbackId}`);
  return response.data;
};

export const getAdminInsights = async (params = {}) => {
  const response = await api.get("/api/v1/admin/insights", { params });
  return response.data;
};

export const getAdminFeedback = async (params = {}) => {
  const response = await api.get("/api/v1/admin/feedback", { params });
  return response.data;
};

export const reanalyzeFeedback = async (feedbackId) => {
  const response = await api.post(
    `/api/v1/admin/feedback/${feedbackId}/reanalyze`,
  );
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/v1/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/api/v1/auth/register", userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
};

export default api;
