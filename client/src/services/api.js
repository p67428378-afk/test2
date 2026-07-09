import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  (error) => Promise.reject(error),
);

export const authService = {
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const petService = {
  getPets: async (filters = {}) => {
    const params = {};
    if (filters.breed) params.breed = filters.breed;
    if (filters.age) params.age = parseFloat(filters.age);
    if (filters.location) params.location = filters.location;

    const response = await api.get("/api/v1/pets", { params });
    return response.data;
  },
  getPet: async (petId) => {
    const response = await api.get(`/api/v1/pets/${petId}`);
    return response.data;
  },
  createPet: async (petData) => {
    const response = await api.post("/api/v1/admin/pets", petData);
    return response.data;
  },
  updatePet: async (petId, petData) => {
    const response = await api.put(`/api/v1/admin/pets/${petId}`, petData);
    return response.data;
  },
  deletePet: async (petId) => {
    const response = await api.delete(`/api/v1/admin/pets/${petId}`);
    return response.data;
  },
};

export const applicationService = {
  submitApplication: async (applicationData) => {
    const response = await api.post("/api/v1/applications", applicationData);
    return response.data;
  },
  getApplications: async () => {
    const response = await api.get("/api/v1/admin/applications");
    return response.data;
  },
  updateApplicationStatus: async (appId, status) => {
    const response = await api.put(`/api/v1/admin/applications/${appId}`, {
      status,
    });
    return response.data;
  },
};

export default api;
