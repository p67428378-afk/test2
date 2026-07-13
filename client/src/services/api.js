import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vaultcipher_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  register: async (email, masterPassword) => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      master_password: masterPassword,
    });
    return response.data;
  },

  login: async (email, masterPassword) => {
    const response = await api.post("/api/v1/auth/login", {
      email,
      master_password: masterPassword,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("vaultcipher_token", response.data.access_token);
      localStorage.setItem("vaultcipher_email", email);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("vaultcipher_token");
    localStorage.removeItem("vaultcipher_email");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("vaultcipher_token");
  },

  getEmail: () => {
    return localStorage.getItem("vaultcipher_email") || "";
  },
};

export const credentialsService = {
  getAll: async () => {
    const response = await api.get("/api/v1/credentials");
    return response.data;
  },

  create: async (credentialData) => {
    const response = await api.post("/api/v1/credentials", credentialData);
    return response.data;
  },

  update: async (id, credentialData) => {
    const response = await api.put(`/api/v1/credentials/${id}`, credentialData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/credentials/${id}`);
    return response.data;
  },
};

export default api;
