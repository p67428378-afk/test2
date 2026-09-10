import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
