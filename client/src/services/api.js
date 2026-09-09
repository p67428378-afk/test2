import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Authorization Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dems_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token expiration or 401/403 audit alerts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401
      localStorage.removeItem("dems_token");
      localStorage.removeItem("dems_user");
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: async (email, password) => {
    const res = await api.post("/api/v1/auth/login", { email, password });
    if (res.data && res.data.access_token) {
      localStorage.setItem("dems_token", res.data.access_token);
      localStorage.setItem("dems_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post("/api/v1/auth/register", userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get("/api/v1/auth/me");
    return res.data;
  },
  logout: async () => {
    try {
      await api.post("/api/v1/auth/logout");
    } catch {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("dems_token");
      localStorage.removeItem("dems_user");
    }
  },
};

export const evidenceAPI = {
  requestUploadUrl: async (uploadData) => {
    const res = await api.post("/api/v1/evidence/upload-url", uploadData);
    return res.data;
  },
  confirmUpload: async (confirmData) => {
    const res = await api.post("/api/v1/evidence/confirm-upload", confirmData);
    return res.data;
  },
  uploadDirect: async (formData) => {
    const res = await api.post("/api/v1/evidence/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  listEvidence: async (params = {}) => {
    const res = await api.get("/api/v1/evidence", { params });
    return res.data;
  },
  getEvidence: async (evidenceId) => {
    const res = await api.get(`/api/v1/evidence/${evidenceId}`);
    return res.data;
  },
  verifyIntegrity: async (evidenceId) => {
    const res = await api.get(`/api/v1/evidence/${evidenceId}/verify`);
    return res.data;
  },
  getDownloadUrl: async (evidenceId) => {
    const res = await api.get(`/api/v1/evidence/${evidenceId}/download`);
    return res.data;
  },
};

export const custodyAPI = {
  transferCustody: async (transferData) => {
    const res = await api.post(
      "/api/v1/chain-of-custody/transfer",
      transferData,
    );
    return res.data;
  },
  recordAction: async (actionData) => {
    const res = await api.post("/api/v1/chain-of-custody/action", actionData);
    return res.data;
  },
  getHistory: async (evidenceId) => {
    const res = await api.get(`/api/v1/chain-of-custody/${evidenceId}`);
    return res.data;
  },
};

export const casesAPI = {
  getStats: async () => {
    const res = await api.get("/api/v1/cases/stats/summary");
    return res.data;
  },
  listCases: async (params = {}) => {
    const res = await api.get("/api/v1/cases", { params });
    return res.data;
  },
  createCase: async (caseData) => {
    const res = await api.post("/api/v1/cases", caseData);
    return res.data;
  },
  getCase: async (caseId) => {
    const res = await api.get(`/api/v1/cases/${caseId}`);
    return res.data;
  },
  updateCase: async (caseId, updateData) => {
    const res = await api.put(`/api/v1/cases/${caseId}`, updateData);
    return res.data;
  },
  assignEvidence: async (caseId, evidenceIds) => {
    const res = await api.post(`/api/v1/cases/${caseId}/evidence`, {
      evidence_ids: evidenceIds,
    });
    return res.data;
  },
  unassignEvidence: async (caseId, evidenceId) => {
    const res = await api.delete(
      `/api/v1/cases/${caseId}/evidence/${evidenceId}`,
    );
    return res.data;
  },
};

export const auditAPI = {
  listLogs: async (params = {}) => {
    const res = await api.get("/api/v1/audit-logs", { params });
    return res.data;
  },
};

export const rbacAPI = {
  getRolesMatrix: async () => {
    const res = await api.get("/api/v1/rbac/roles");
    return res.data;
  },
  listUsers: async () => {
    const res = await api.get("/api/v1/rbac/users");
    return res.data;
  },
  updateUserRole: async (userId, role) => {
    const res = await api.put(`/api/v1/rbac/users/${userId}/role`, { role });
    return res.data;
  },
};

export default api;
