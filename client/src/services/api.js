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
  login: async (email, password) => {
    // OAuth2PasswordBearer expects x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await api.post("/api/v1/auth/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },
};

export const propertyService = {
  list: async (filters = {}) => {
    const response = await api.get("/api/v1/properties", { params: filters });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/properties/${id}`);
    return response.data;
  },
  create: async (propertyData) => {
    const response = await api.post("/api/v1/properties", propertyData);
    return response.data;
  },
  update: async (id, propertyData) => {
    const response = await api.put(`/api/v1/properties/${id}`, propertyData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/properties/${id}`);
    return response.data;
  },
};

export const messageService = {
  send: async (messageData) => {
    const response = await api.post("/api/v1/messages", messageData);
    return response.data;
  },
  list: async (filters = {}) => {
    const response = await api.get("/api/v1/messages", { params: filters });
    return response.data;
  },
};

export default api;
