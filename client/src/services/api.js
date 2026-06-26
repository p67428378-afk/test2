import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to inject JWT token
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
  login: async (login_id, password) => {
    const response = await api.post("/api/v1/auth/login", {
      login_id,
      password,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/users/me");
    return response.data;
  },
};

export const leaveService = {
  applyLeave: async (leave_type, start_date, end_date, reason) => {
    const response = await api.post("/api/v1/leave-requests", {
      leave_type,
      start_date,
      end_date,
      reason,
    });
    return response.data;
  },
  getMyRequests: async () => {
    const response = await api.get("/api/v1/leave-requests/me");
    return response.data;
  },
  getTeamRequests: async (statusFilter = null) => {
    const params = statusFilter ? { status_filter: statusFilter } : {};
    const response = await api.get("/api/v1/leave-requests/team", { params });
    return response.data;
  },
  updateRequestStatus: async (requestId, status, comment = null) => {
    const response = await api.put(
      `/api/v1/leave-requests/${requestId}/status`,
      {
        status,
        comment,
      },
    );
    return response.data;
  },
};

export default api;
