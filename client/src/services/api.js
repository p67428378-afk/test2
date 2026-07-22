import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getKPIs = async () => {
  const response = await api.get("/api/v1/assortment/kpis");
  return response.data;
};

export const getSKUs = async (params = {}) => {
  const response = await api.get("/api/v1/assortment/skus", { params });
  return response.data;
};

export const getScenarioProjection = async (scenarioName) => {
  const response = await api.post("/api/v1/assortment/scenario", {
    scenario_name: scenarioName,
  });
  return response.data;
};

export const submitAssortmentPlan = async (payload) => {
  const response = await api.post("/api/v1/assortment/submit", payload);
  return response.data;
};

// Password Reset APIs (optional but supported by backend)
export const initiatePasswordReset = async (loginId, mobileNumber) => {
  const response = await api.post("/api/v1/password-reset/initiate", {
    login_id: loginId,
    mobile_number: mobileNumber,
  });
  return response.data;
};

export const verifyOTP = async (otpCode, otpSessionId) => {
  const response = await api.post("/api/v1/password-reset/verify-otp", {
    otp_code: otpCode,
    otp_session_id: otpSessionId,
  });
  return response.data;
};

export const verifySecurityQuestion = async (
  answer,
  securityQuestionSessionId,
) => {
  const response = await api.post(
    "/api/v1/password-reset/verify-security-question",
    {
      answer,
      security_question_session_id: securityQuestionSessionId,
    },
  );
  return response.data;
};

export const setNewPassword = async (newPassword, passwordResetSessionId) => {
  const response = await api.post("/api/v1/password-reset/set-new-password", {
    new_password: newPassword,
    password_reset_session_id: passwordResetSessionId,
  });
  return response.data;
};

export default api;
