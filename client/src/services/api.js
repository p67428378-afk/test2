import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject JWT token
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

// Response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("guide");
      // Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("guide", JSON.stringify(response.data.guide));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("guide");
  },
  getCurrentGuide: () => {
    const guideStr = localStorage.getItem("guide");
    return guideStr ? JSON.parse(guideStr) : null;
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  // Password Reset Flow
  initiatePasswordReset: async (loginId, mobileNumber) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      login_id: loginId,
      mobile_number: mobileNumber,
    });
    return response.data;
  },
  verifyOTP: async (otpCode, otpSessionId) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", {
      otp_code: otpCode,
      otp_session_id: otpSessionId,
    });
    return response.data;
  },
  verifySecurityQuestion: async (answer, securityQuestionSessionId) => {
    const response = await api.post(
      "/api/v1/password-reset/verify-security-question",
      {
        answer,
        security_question_session_id: securityQuestionSessionId,
      },
    );
    return response.data;
  },
  setNewPassword: async (newPassword, passwordResetSessionId) => {
    const response = await api.post("/api/v1/password-reset/set-new-password", {
      new_password: newPassword,
      password_reset_session_id: passwordResetSessionId,
    });
    return response.data;
  },
};

export const bookingsService = {
  getBookings: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/bookings", {
      params: { skip, limit },
    });
    return response.data;
  },
  getBookingDetail: async (bookingId) => {
    const response = await api.get(`/api/v1/bookings/${bookingId}`);
    return response.data;
  },
  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/api/v1/bookings/${bookingId}`, { status });
    return response.data;
  },
  getMessages: async (bookingId) => {
    const response = await api.get(`/api/v1/bookings/${bookingId}/messages`);
    return response.data;
  },
  sendMessage: async (bookingId, messageBody) => {
    const response = await api.post(`/api/v1/bookings/${bookingId}/messages`, {
      message_body: messageBody,
    });
    return response.data;
  },
};

export const availabilityService = {
  getAvailability: async () => {
    const response = await api.get("/api/v1/availability");
    return response.data;
  },
  updateAvailability: async (unavailableDates) => {
    const response = await api.put("/api/v1/availability", {
      unavailable_dates: unavailableDates,
    });
    return response.data;
  },
};

export default api;
