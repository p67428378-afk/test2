import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const passwordService = {
  generatePassword: async (options = {}) => {
    const payload = {
      length: options.length ?? 16,
      include_uppercase: options.include_uppercase ?? true,
      include_lowercase: options.include_lowercase ?? true,
      include_digits: options.include_digits ?? true,
      include_symbols: options.include_symbols ?? true,
    };
    const response = await api.post("/api/v1/passwords/generate", payload);
    return response.data;
  },
  generateBatch: async (count = 10, options = {}) => {
    const requests = Array.from({ length: count }, () =>
      passwordService.generatePassword(options),
    );
    return await Promise.all(requests);
  },
};

export const healthService = {
  checkHealth: async () => {
    const response = await api.get("/api/v1/health");
    return response.data;
  },
};

export default api;
