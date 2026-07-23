import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const worklistService = {
  getWorklist: async (params = {}) => {
    const response = await api.get("/api/v1/worklist", { params });
    return response.data;
  },
  createWorklistItem: async (title, status = "pending") => {
    const response = await api.post("/api/v1/worklist", { title, status });
    return response.data;
  },
};

export const passwordResetService = {
  initiate: async (login_id, mobile_number) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      login_id,
      mobile_number,
    });
    return response.data;
  },
  verifyOtp: async (otp_code, otp_session_id) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", {
      otp_code,
      otp_session_id,
    });
    return response.data;
  },
  verifySecurityQuestion: async (answer, security_question_session_id) => {
    const response = await api.post(
      "/api/v1/password-reset/verify-security-question",
      { answer, security_question_session_id },
    );
    return response.data;
  },
  setNewPassword: async (new_password, password_reset_session_id) => {
    const response = await api.post("/api/v1/password-reset/set-new-password", {
      new_password,
      password_reset_session_id,
    });
    return response.data;
  },
};

export default api;
