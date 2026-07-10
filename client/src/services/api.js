import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
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
  login: async (username_or_email, password) => {
    const response = await api.post("/api/v1/login", {
      username_or_email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("userId", response.data.user_id);
    }
    return response.data;
  },
  register: async (full_name, email, password, date_of_birth) => {
    const response = await api.post("/api/v1/register", {
      full_name,
      email,
      password,
      date_of_birth,
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  },
  getCurrentUser: () => {
    return {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      userId: localStorage.getItem("userId"),
    };
  },
  initiatePasswordReset: async (email) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      email,
    });
    return response.data;
  },
  verifyOtp: async (otp, password_reset_session_id) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", {
      otp,
      password_reset_session_id,
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

export const visitorService = {
  uploadId: async (visitorId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      `/api/v1/visitors/${visitorId}/upload-id`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

export const appointmentService = {
  create: async (inmate_id, requested_datetime) => {
    const response = await api.post("/api/v1/appointments", {
      inmate_id,
      requested_datetime,
    });
    return response.data;
  },
  list: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/appointments", {
      params: { skip, limit },
    });
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/api/v1/appointments/${id}/status`, {
      status,
    });
    return response.data;
  },
};

export const visitService = {
  checkIn: async (appointment_id, notes = "") => {
    const response = await api.post("/api/v1/visits/check-in", {
      appointment_id,
      notes,
    });
    return response.data;
  },
  checkOut: async (visit_log_id, notes = "") => {
    const response = await api.post("/api/v1/visits/check-out", {
      visit_log_id,
      notes,
    });
    return response.data;
  },
  getInmateHistory: async (inmateId) => {
    const response = await api.get(`/api/v1/inmates/${inmateId}/history`);
    return response.data;
  },
};

export default api;
