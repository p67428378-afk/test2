import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
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
  login: async (username, password) => {
    const response = await api.post("/api/v1/auth/login", {
      username,
      password,
    });
    if (response.data && response.data.access_token) {
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

export const plotTypeService = {
  getPlotTypes: async () => {
    const response = await api.get("/api/v1/plot-types");
    return response.data;
  },
};

export const plotService = {
  getPlots: async (filters = {}) => {
    const params = {};
    if (filters.plot_type_id) params.plot_type_id = filters.plot_type_id;
    if (filters.status) params.status = filters.status;
    if (filters.section) params.section = filters.section;
    if (filters.lot) params.lot = filters.lot;
    if (filters.plot_number) params.plot_number = filters.plot_number;
    if (filters.skip !== undefined) params.skip = filters.skip;
    if (filters.limit !== undefined) params.limit = filters.limit;

    const response = await api.get("/api/v1/plots", { params });
    return response.data;
  },
  getPlot: async (plotId) => {
    const response = await api.get(`/api/v1/plots/${plotId}`);
    return response.data;
  },
  createPlot: async (plotData) => {
    const response = await api.post("/api/v1/plots", plotData);
    return response.data;
  },
  updatePlot: async (plotId, plotData) => {
    const response = await api.put(`/api/v1/plots/${plotId}`, plotData);
    return response.data;
  },
  deletePlot: async (plotId) => {
    const response = await api.delete(`/api/v1/plots/${plotId}`);
    return response.data;
  },
};

export default api;
