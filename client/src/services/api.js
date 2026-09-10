import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT bearer token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  // User login (supports email/password JSON payload)
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  // User registration
  register: async ({ email, password, full_name }) => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      full_name,
    });
    return response.data;
  },

  // Get current authenticated user profile
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },

  // Logout utility
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },
};

export const resumeService = {
  // List all available resume templates
  getTemplates: async () => {
    const response = await api.get("/api/v1/templates");
    return response.data;
  },

  // List all stored resumes with pagination
  listResumes: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/resumes", {
      params: { skip, limit },
    });
    return response.data;
  },

  // Get a single resume by UUID
  getResume: async (id) => {
    const response = await api.get(`/api/v1/resumes/${id}`);
    return response.data;
  },

  // Create and persist a new resume
  createResume: async (resumeData) => {
    const response = await api.post("/api/v1/resumes", resumeData);
    return response.data;
  },

  // Update an existing resume
  updateResume: async (id, resumeData) => {
    const response = await api.put(`/api/v1/resumes/${id}`, resumeData);
    return response.data;
  },

  // Delete a resume
  deleteResume: async (id) => {
    const response = await api.delete(`/api/v1/resumes/${id}`);
    return response.data;
  },

  // Export vector PDF CV
  exportPdf: async (exportPayload) => {
    const response = await api.post(
      "/api/v1/resumes/export-pdf",
      exportPayload,
      {
        responseType: "blob",
      },
    );
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get("/api/v1/health");
    return response.data;
  },
};

export default api;
