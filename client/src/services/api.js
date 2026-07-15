import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fortress_token");
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
  register: async (email, masterPassword) => {
    const response = await api.post("/api/v1/users/register", {
      email,
      master_password: masterPassword,
    });
    return response.data;
  },

  login: async (email, masterPassword) => {
    const response = await api.post("/api/v1/users/login", {
      email,
      master_password: masterPassword,
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("fortress_token", response.data.access_token);
      localStorage.setItem("fortress_user_email", email);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("fortress_token");
    localStorage.removeItem("fortress_user_email");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("fortress_token");
  },

  getUserEmail: () => {
    return localStorage.getItem("fortress_user_email") || "";
  },
};

export const passwordService = {
  getAll: async () => {
    const response = await api.get("/api/v1/passwords");
    return response.data;
  },

  create: async (title, username, password, url = "") => {
    const response = await api.post("/api/v1/passwords", {
      title,
      username,
      password,
      url,
    });
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/api/v1/passwords/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/passwords/${id}`);
    return response.data;
  },

  generate: async (options = {}) => {
    const response = await api.post("/api/v1/passwords/generate", {
      length: options.length || 16,
      include_uppercase: options.includeUppercase !== false,
      include_lowercase: options.includeLowercase !== false,
      include_numbers: options.includeNumbers !== false,
      include_symbols: options.includeSymbols !== false,
    });
    return response.data;
  },
};

export default api;
