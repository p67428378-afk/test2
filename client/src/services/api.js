import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const poseService = {
  getPoses: async (params = {}) => {
    const response = await api.get("/api/v1/poses", { params });
    return response.data;
  },
  getPose: async (id, userId = "default_user") => {
    const response = await api.get(`/api/v1/poses/${id}`, {
      params: { user_id: userId },
    });
    return response.data;
  },
  createPose: async (data) => {
    const response = await api.post("/api/v1/poses", data);
    return response.data;
  },
  getFavorites: async (userId = "default_user") => {
    const response = await api.get("/api/v1/poses/favorites", {
      params: { user_id: userId },
    });
    return response.data;
  },
  addFavorite: async (id, userId = "default_user") => {
    const response = await api.post(`/api/v1/poses/${id}/favorite`, null, {
      params: { user_id: userId },
    });
    return response.data;
  },
  removeFavorite: async (id, userId = "default_user") => {
    const response = await api.delete(`/api/v1/poses/${id}/favorite`, {
      params: { user_id: userId },
    });
    return response.data;
  },
};

export const routineService = {
  getRoutines: async (params = {}) => {
    const response = await api.get("/api/v1/routines", { params });
    return response.data;
  },
  getRoutine: async (id) => {
    const response = await api.get(`/api/v1/routines/${id}`);
    return response.data;
  },
  createRoutine: async (data) => {
    const response = await api.post("/api/v1/routines", data);
    return response.data;
  },
  updateRoutine: async (id, data) => {
    const response = await api.put(`/api/v1/routines/${id}`, data);
    return response.data;
  },
  deleteRoutine: async (id) => {
    const response = await api.delete(`/api/v1/routines/${id}`);
    return response.data;
  },
  duplicateRoutine: async (id) => {
    const response = await api.post(`/api/v1/routines/${id}/duplicate`);
    return response.data;
  },
  exportRoutine: async (id, format = "pdf") => {
    if (format === "pdf") {
      const response = await api.get(`/api/v1/routines/${id}/export`, {
        params: { format: "pdf" },
        responseType: "blob",
      });
      return response.data;
    }
    const response = await api.get(`/api/v1/routines/${id}/export`, {
      params: { format: "json" },
    });
    return response.data;
  },
};

export const practiceService = {
  logPracticeSession: async (data) => {
    const response = await api.post("/api/v1/practice-sessions", data);
    return response.data;
  },
  getPracticeSessions: async (userId = "default_user", params = {}) => {
    const response = await api.get("/api/v1/practice-sessions", {
      params: { user_id: userId, ...params },
    });
    return response.data;
  },
};

export default api;
