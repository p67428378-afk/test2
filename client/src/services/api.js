import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shieldvault_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
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
    if (response.data.access_token) {
      localStorage.setItem("shieldvault_token", response.data.access_token);
      localStorage.setItem("shieldvault_email", email);
      localStorage.setItem("shieldvault_salt", response.data.derived_key_salt);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("shieldvault_token");
    localStorage.removeItem("shieldvault_email");
    localStorage.removeItem("shieldvault_salt");
  },

  getCurrentUser: () => {
    const token = localStorage.getItem("shieldvault_token");
    const email = localStorage.getItem("shieldvault_email");
    if (!token) return null;
    return { email };
  },
};

export const credentialService = {
  list: async () => {
    const response = await api.get("/api/v1/credentials");
    return response.data;
  },

  create: async (encryptedData) => {
    const response = await api.post("/api/v1/credentials", {
      encrypted_data: encryptedData,
    });
    return response.data;
  },

  update: async (id, encryptedData) => {
    const response = await api.put(`/api/v1/credentials/${id}`, {
      encrypted_data: encryptedData,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/v1/credentials/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(
      `/api/v1/credentials/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
};

export const vaultService = {
  generatePassword: async (
    length,
    includeLowercase,
    includeUppercase,
    includeNumbers,
    includeSymbols,
  ) => {
    const response = await api.post("/api/v1/generate-password", {
      length,
      include_lowercase: includeLowercase,
      include_uppercase: includeUppercase,
      include_numbers: includeNumbers,
      include_symbols: includeSymbols,
    });
    return response.data;
  },

  importVault: async (csvData) => {
    const response = await api.post("/api/v1/vault/import", {
      csv_data: csvData,
    });
    return response.data;
  },

  exportVault: async () => {
    const response = await api.get("/api/v1/vault/export");
    return response.data;
  },
};

export default api;
