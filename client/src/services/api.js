import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Password Reset Endpoints
  initiatePasswordReset: async (loginId, mobileNumber) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      login_id: loginId,
      mobile_number: mobileNumber,
    });
    return response.data;
  },
  verifyOtp: async (otpCode, otpSessionId) => {
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

  // Animals Endpoints
  getAnimals: async () => {
    const response = await api.get("/api/v1/animals");
    return response.data;
  },
  createAnimal: async (animalData) => {
    const response = await api.post("/api/v1/animals", animalData);
    return response.data;
  },
  getLatestLocations: async () => {
    const response = await api.get("/api/v1/animals/locations");
    return response.data;
  },
  recordLocation: async (locationData) => {
    const response = await api.post("/api/v1/animals/locations", locationData);
    return response.data;
  },
  getMigrationPattern: async (animalId) => {
    const response = await api.get(`/api/v1/animals/${animalId}/migration`);
    return response.data;
  },

  // Health Examinations Endpoints
  getHealthExaminations: async (animalId = null) => {
    const params = animalId ? { animal_id: animalId } : {};
    const response = await api.get("/api/v1/health-examinations", { params });
    return response.data;
  },
  createHealthExamination: async (examData) => {
    const response = await api.post("/api/v1/health-examinations", examData);
    return response.data;
  },

  // Protected Zones Endpoints
  getProtectedZones: async () => {
    const response = await api.get("/api/v1/protected-zones");
    return response.data;
  },
  createProtectedZone: async (zoneData) => {
    const response = await api.post("/api/v1/protected-zones", zoneData);
    return response.data;
  },
  updateProtectedZone: async (zoneId, zoneData) => {
    const response = await api.put(
      `/api/v1/protected-zones/${zoneId}`,
      zoneData,
    );
    return response.data;
  },
  deleteProtectedZone: async (zoneId) => {
    const response = await api.delete(`/api/v1/protected-zones/${zoneId}`);
    return response.data;
  },

  // Reports Endpoints
  getConservationReport: async () => {
    const response = await api.get("/api/v1/reports/conservation");
    return response.data;
  },
};
