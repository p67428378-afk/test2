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
    const token = localStorage.getItem("lockbox_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  register: async (username, masterPassword) => {
    const response = await api.post("/api/v1/auth/register", {
      username,
      master_password: masterPassword,
    });
    return response.data;
  },

  login: async (username, masterPassword) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      master_password: masterPassword,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("lockbox_token", response.data.access_token);
      localStorage.setItem("lockbox_username", username);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("lockbox_token");
    localStorage.removeItem("lockbox_username");
  },

  getCurrentUser: () => {
    const token = localStorage.getItem("lockbox_token");
    const username = localStorage.getItem("lockbox_username");
    if (token && username) {
      return { username };
    }
    return null;
  },
};

export const credentialsService = {
  getAll: async (search = "") => {
    const params = {};
    if (search) {
      params.search = search;
    }
    const response = await api.get("/api/v1/credentials", { params });
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

export const passwordService = {
  generate: async (options = {}) => {
    const response = await api.post("/api/v1/passwords/generate", {
      length: options.length || 16,
      lowercase: options.lowercase !== undefined ? options.lowercase : true,
      uppercase: options.uppercase !== undefined ? options.uppercase : true,
      numbers: options.numbers !== undefined ? options.numbers : true,
      symbols: options.symbols !== undefined ? options.symbols : true,
    });
    return response.data;
  },
};

export default api;
