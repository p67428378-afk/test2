import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const categoryService = {
  getCategories: async () => {
    const response = await api.get("/api/v1/categories");
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/api/v1/categories/${id}`);
    return response.data;
  },

  createCategory: async (name) => {
    const response = await api.post("/api/v1/categories", { name });
    return response.data;
  },
};

export const parkingService = {
  searchSpots: async (params = {}) => {
    const response = await api.get("/api/v1/parking-spots/search", { params });
    return response.data;
  },

  listSpots: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/parking-spots", {
      params: { skip, limit },
    });
    return response.data;
  },

  getSpotDetails: async (spot_id) => {
    const response = await api.get(`/api/v1/parking-spots/${spot_id}`);
    return response.data;
  },

  getSpotRates: async (spot_id, target_date = null) => {
    const params = {};
    if (target_date) params.target_date = target_date;
    const response = await api.get(`/api/v1/parking-spots/${spot_id}/rates`, {
      params,
    });
    return response.data;
  },

  calculateCost: async (spot_id, hours, start_time = null) => {
    const response = await api.post(
      `/api/v1/parking-spots/${spot_id}/calculate-cost`,
      { hours, start_time },
    );
    return response.data;
  },

  updateSpotStatus: async (spot_id, status = null, available_spots = null) => {
    const payload = {};
    if (status !== null) payload.status = status;
    if (available_spots !== null) payload.available_spots = available_spots;
    const response = await api.post(
      `/api/v1/parking-spots/${spot_id}/status`,
      payload,
    );
    return response.data;
  },

  getRecentEvents: async (limit = 20) => {
    const response = await api.get("/api/v1/parking-spots/events/recent", {
      params: { limit },
    });
    return response.data;
  },

  createParkingLocation: async (data) => {
    const response = await api.post("/api/v1/parking-spots", data);
    return response.data;
  },
};

export const getWebSocketUrl = () => {
  const cleanBase = BASE_URL.replace(/^https?:\/\//, "");
  const protocol = BASE_URL.startsWith("https") ? "wss:" : "ws:";
  return `${protocol}//${cleanBase}/api/v1/parking-spots/live-updates`;
};

export default api;
