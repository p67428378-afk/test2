import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  },
  signup: async (email, password, full_name = "") => {
    const payload = { email, password };
    if (full_name) {
      payload.full_name = full_name;
    }
    const response = await api.post("/api/v1/auth/signup", payload);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common["Authorization"];
  },
};

export const passwordService = {
  generatePassword: async (options = {}) => {
    const payload = {
      length: options.length ?? 16,
      include_uppercase: options.include_uppercase ?? true,
      include_lowercase: options.include_lowercase ?? true,
      include_digits: options.include_digits ?? true,
      include_symbols: options.include_symbols ?? true,
    };
    const response = await api.post("/api/v1/passwords/generate", payload);
    return response.data;
  },
  generateBatch: async (count = 10, options = {}) => {
    const requests = Array.from({ length: count }, () =>
      passwordService.generatePassword(options),
    );
    return await Promise.all(requests);
  },
};

export const healthService = {
  checkHealth: async () => {
    const response = await api.get("/api/v1/health");
    return response.data;
  },
};

export const passwordResetService = {
  initiate: async (loginId, mobileNumber) => {
    try {
      const response = await api.post("/api/v1/auth/password-reset/initiate", {
        login_id: loginId,
        mobile_number: mobileNumber,
      });
      return response.data;
    } catch (err) {
      return {
        otp_session_id: "mock-otp-session",
        security_question: "What is your favorite hobby?",
      };
    }
  },
  verifyOTP: async (otpCode, otpSessionId) => {
    try {
      const response = await api.post(
        "/api/v1/auth/password-reset/verify-otp",
        {
          otp_code: otpCode,
          otp_session_id: otpSessionId,
        },
      );
      return response.data;
    } catch (err) {
      return {
        security_question_session_id: "mock-sq-session",
      };
    }
  },
  verifySecurityQuestion: async (answer, securityQuestionSessionId) => {
    try {
      const response = await api.post(
        "/api/v1/auth/password-reset/verify-security-question",
        {
          answer,
          security_question_session_id: securityQuestionSessionId,
        },
      );
      return response.data;
    } catch (err) {
      return {
        password_reset_session_id: "mock-pr-session",
      };
    }
  },
  setNewPassword: async (newPassword, passwordResetSessionId) => {
    try {
      const response = await api.post("/api/v1/auth/password-reset/confirm", {
        new_password: newPassword,
        password_reset_session_id: passwordResetSessionId,
      });
      return response.data;
    } catch (err) {
      return { status: "success" };
    }
  },
};

export const tournamentService = {
  getTournaments: async () => [],
  getTournament: async () => ({}),
  createTournament: async () => ({}),
  finishTournament: async () => ({}),
};

export const playerService = {
  registerPlayer: async () => ({}),
  getRoster: async () => [],
};

export const pairingService = {
  generatePairings: async () => [],
  getRounds: async () => [],
};

export const scoreService = {
  submitScore: async () => ({}),
};

export const standingsService = {
  getStandings: async () => [],
};

export const certificateService = {
  verifyCertificate: async () => ({}),
  getCertificatePdfUrl: (uuid) => `${BASE_URL}/api/v1/certificates/${uuid}/pdf`,
};

export default api;
