import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach Bearer token if available
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

// Auth services
export async function loginUser(email, password) {
  const response = await api.post("/api/v1/auth/login", { email, password });
  if (response.data?.access_token) {
    localStorage.setItem("token", response.data.access_token);
    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  }
  return response.data;
}

export async function registerUser(email, password, role = "user") {
  const response = await api.post("/api/v1/auth/register", {
    email,
    password,
    role,
  });
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/api/v1/auth/me");
  return response.data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Feedback Ingestion
export async function submitFeedback(payload) {
  const response = await api.post("/api/v1/feedback", payload);
  return response.data;
}

export async function getFeedbackById(id) {
  const response = await api.get(`/api/v1/feedback/${id}`);
  return response.data;
}

// Admin Insights & Analytics
export async function getAdminInsights(timeframe = "30d") {
  const response = await api.get("/api/v1/admin/insights", {
    params: { timeframe },
  });
  return response.data;
}

export async function listAdminFeedback(params = {}) {
  const response = await api.get("/api/v1/admin/feedback", { params });
  return response.data;
}

export async function listAdminAlerts(params = {}) {
  const response = await api.get("/api/v1/admin/alerts", { params });
  return response.data;
}

export async function exportAdminCsv(params = {}) {
  const response = await api.get("/api/v1/admin/export", {
    params,
    responseType: "blob",
  });
  return response.data;
}
