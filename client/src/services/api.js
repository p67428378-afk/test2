import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
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
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const componentService = {
  list: async (params = {}) => {
    const response = await api.get("/api/v1/components", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/api/v1/components", data);
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/components/${id}`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/v1/components/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/components/${id}`);
    return response.data;
  },
};

export const missionService = {
  list: async (params = {}) => {
    const response = await api.get("/api/v1/missions", { params });
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/api/v1/missions", data);
    return response.data;
  },
  assignEquipment: async (missionId, componentId) => {
    const response = await api.post(`/api/v1/missions/${missionId}/equipment`, {
      component_id: componentId,
    });
    return response.data;
  },
  getEquipment: async (missionId) => {
    const response = await api.get(`/api/v1/missions/${missionId}/equipment`);
    return response.data;
  },
};

export const inspectionService = {
  list: async (params = {}) => {
    const response = await api.get("/api/v1/inspections", { params });
    return response.data;
  },
  schedule: async (data) => {
    const response = await api.post("/api/v1/inspections", data);
    return response.data;
  },
};

export const alertService = {
  trigger: async (intervals = [30, 60, 90]) => {
    const response = await api.post("/api/v1/alerts/trigger", null, {
      params: { intervals },
    });
    return response.data;
  },
};

export default api;
