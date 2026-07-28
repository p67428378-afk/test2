import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to attach JWT token
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
  async login(username, password) {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(username, password, role_name) {
    const response = await api.post("/api/v1/auth/register", {
      username,
      password,
      role_name,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};

export const caseService = {
  async getCases() {
    const response = await api.get("/api/v1/cases");
    return response.data;
  },

  async createCase(case_number, description) {
    const response = await api.post("/api/v1/cases", {
      case_number,
      description,
    });
    return response.data;
  },

  async getCaseEvidence(caseId) {
    const response = await api.get(`/api/v1/cases/${caseId}/evidence`);
    return response.data;
  },

  async assignEvidence(caseId, evidenceId) {
    const response = await api.post(`/api/v1/cases/${caseId}/evidence`, {
      evidence_id: evidenceId,
    });
    return response.data;
  },
};

export const evidenceService = {
  async uploadEvidenceMetadata(
    filename,
    file_type,
    file_size,
    sha256_hash,
    case_id = null,
  ) {
    const payload = { filename, file_type, file_size, sha256_hash };
    if (case_id) {
      payload.case_id = case_id;
    }
    const response = await api.post("/api/v1/evidence/upload", payload);
    return response.data;
  },

  async uploadFileMock(id, file) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(
      `/api/v1/evidence/upload-file/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async getEvidence(id) {
    const response = await api.get(`/api/v1/evidence/${id}`);
    return response.data;
  },

  async analyzeEvidence(id) {
    const response = await api.post(`/api/v1/evidence/${id}/analyze`);
    return response.data;
  },
};

export const auditService = {
  async getAuditLogs() {
    const response = await api.get("/api/v1/audit-log");
    return response.data;
  },

  async getChainOfCustody(evidenceId) {
    const response = await api.get(`/api/v1/chain-of-custody/${evidenceId}`);
    return response.data;
  },
};

export default api;
