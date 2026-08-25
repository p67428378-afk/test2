import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Request interceptor to add auth token
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
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  register: async (email, password, role) => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      role,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};

export const jobsService = {
  createJob: async (jobData) => {
    const response = await api.post("/api/v1/jobs", jobData);
    return response.data;
  },
  listJobs: async (params = {}) => {
    const response = await api.get("/api/v1/jobs", { params });
    return response.data;
  },
  getJob: async (jobId) => {
    const response = await api.get(`/api/v1/jobs/${jobId}`);
    return response.data;
  },
  updateJob: async (jobId, jobData) => {
    const response = await api.put(`/api/v1/jobs/${jobId}`, jobData);
    return response.data;
  },
  deleteJob: async (jobId) => {
    const response = await api.delete(`/api/v1/jobs/${jobId}`);
    return response.data;
  },
};

export const applicationsService = {
  applyForJob: async (jobId, coverLetter, resumeFile) => {
    const formData = new FormData();
    if (coverLetter) {
      formData.append("cover_letter", coverLetter);
    }
    formData.append("resume", resumeFile);
    const response = await api.post(`/api/v1/jobs/${jobId}/apply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  listApplications: async (jobId) => {
    const response = await api.get(`/api/v1/jobs/${jobId}/applications`);
    return response.data;
  },
  updateStatus: async (applicationId, status) => {
    const response = await api.patch(
      `/api/v1/applications/${applicationId}/status`,
      { status },
    );
    return response.data;
  },
};

export default api;
