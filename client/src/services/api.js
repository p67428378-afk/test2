import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const scheduleService = {
  getSchedules: async (params = {}) => {
    const response = await api.get("/api/v1/schedules", { params });
    return response.data;
  },
  getSchedule: async (id) => {
    const response = await api.get(`/api/v1/schedules/${id}`);
    return response.data;
  },
  createSchedule: async (data) => {
    const response = await api.post("/api/v1/schedules", data);
    return response.data;
  },
  updateSchedule: async (id, data) => {
    const response = await api.put(`/api/v1/schedules/${id}`, data);
    return response.data;
  },
};

export const expeditionService = {
  getExpeditions: async (params = {}) => {
    const response = await api.get("/api/v1/expeditions", { params });
    return response.data;
  },
  createExpedition: async (data) => {
    const response = await api.post("/api/v1/expeditions", data);
    return response.data;
  },
  getExpeditionCrew: async (expeditionId) => {
    const response = await api.get(`/api/v1/expeditions/${expeditionId}/crew`);
    return response.data;
  },
  assignCrew: async (expeditionId, data) => {
    const response = await api.post(
      `/api/v1/expeditions/${expeditionId}/crew`,
      data,
    );
    return response.data;
  },
};

export const equipmentService = {
  getEquipment: async (params = {}) => {
    const response = await api.get("/api/v1/equipment", { params });
    return response.data;
  },
  updateEquipment: async (id, data) => {
    const response = await api.put(`/api/v1/equipment/${id}`, data);
    return response.data;
  },
};

export const fuelService = {
  getFuelSummary: async (params = {}) => {
    const response = await api.get("/api/v1/fuel/summary", { params });
    return response.data;
  },
  createFuelLog: async (data) => {
    const response = await api.post("/api/v1/fuel/logs", data);
    return response.data;
  },
};

export const weatherService = {
  getWeatherAlerts: async (latitude, longitude) => {
    const response = await api.get("/api/v1/weather/alerts", {
      params: { latitude, longitude },
    });
    return response.data;
  },
};

export const crewService = {
  getCrew: async (params = {}) => {
    const response = await api.get("/api/v1/crew", { params });
    return response.data;
  },
  createCrew: async (data) => {
    const response = await api.post("/api/v1/crew", data);
    return response.data;
  },
};

export const sampleService = {
  getSamples: async (params = {}) => {
    const response = await api.get("/api/v1/samples", { params });
    return response.data;
  },
  createSample: async (data) => {
    const response = await api.post("/api/v1/samples", data);
    return response.data;
  },
};

export default api;
