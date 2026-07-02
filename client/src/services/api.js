import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const incidentService = {
  getIncidents: async (skip = 0, limit = 100) => {
    const response = await api.get(
      `/api/v1/incidents?skip=${skip}&limit=${limit}`,
    );
    return response.data;
  },
  createIncident: async (incidentData) => {
    const response = await api.post("/api/v1/incidents", incidentData);
    return response.data;
  },
  updateIncident: async (id, updateData) => {
    const response = await api.put(`/api/v1/incidents/${id}`, updateData);
    return response.data;
  },
  getRCA: async (id) => {
    const response = await api.get(`/api/v1/incidents/${id}/rca`);
    return response.data;
  },
  saveRCA: async (id, content) => {
    const response = await api.post(`/api/v1/incidents/${id}/rca`, { content });
    return response.data;
  },
};

export const userService = {
  getUsers: async () => {
    const response = await api.get("/api/v1/users");
    return response.data;
  },
  createUser: async (userData) => {
    const response = await api.post("/api/v1/users", userData);
    return response.data;
  },
};

export const slaService = {
  getSLAs: async () => {
    const response = await api.get("/api/v1/slas");
    return response.data;
  },
  createOrUpdateSLA: async (slaData) => {
    const response = await api.post("/api/v1/slas", slaData);
    return response.data;
  },
};

export default api;
