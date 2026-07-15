import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if present
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
  register: async (email, password, username) => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      username,
    });
    return response.data;
  },
  login: async (username, password) => {
    // OAuth2 password flow uses x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);
    const response = await api.post("/api/v1/auth/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.data.access_token) {
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
  // Password reset endpoints
  initiateReset: async (email) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      email,
    });
    return response.data;
  },
  verifyOtp: async (otp, sessionId) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", {
      otp,
      password_reset_session_id: sessionId,
    });
    return response.data;
  },
  verifySecurityQuestion: async (answer, sessionId) => {
    const response = await api.post(
      "/api/v1/password-reset/verify-security-question",
      { answer, security_question_session_id: sessionId },
    );
    return response.data;
  },
  setNewPassword: async (newPassword, sessionId) => {
    const response = await api.post("/api/v1/password-reset/set-new-password", {
      new_password: newPassword,
      password_reset_session_id: sessionId,
    });
    return response.data;
  },
};

export const propertyService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/api/v1/properties", { params: filters });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/api/v1/properties/${id}`);
    return response.data;
  },
  create: async (propertyData) => {
    const response = await api.post("/api/v1/properties", propertyData);
    return response.data;
  },
  update: async (id, propertyData) => {
    const response = await api.put(`/api/v1/properties/${id}`, propertyData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/properties/${id}`);
    return response.data;
  },
};

export const inquiryService = {
  submit: async (inquiryData) => {
    const response = await api.post("/api/v1/inquiries", inquiryData);
    return response.data;
  },
};

export const brokerService = {
  getDashboard: async () => {
    const response = await api.get("/api/v1/brokers/me/dashboard");
    return response.data;
  },
};

export default api;
