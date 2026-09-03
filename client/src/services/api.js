import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aura_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    if (response.data?.access_token) {
      localStorage.setItem("aura_token", response.data.access_token);
      localStorage.setItem("aura_user", JSON.stringify(response.data));
    }
    return response.data;
  },
  signup: async (userData) => {
    const response = await api.post("/api/v1/auth/signup", userData);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("aura_token");
    localStorage.removeItem("aura_user");
  },
};

export const photographerService = {
  getPhotographers: async () => {
    const response = await api.get("/api/v1/photographers");
    return response.data;
  },
  getPhotographer: async (id) => {
    const response = await api.get(`/api/v1/photographers/${id}`);
    return response.data;
  },
  getAvailability: async (id) => {
    const response = await api.get(`/api/v1/photographers/${id}/availability`);
    return response.data;
  },
  setAvailability: async (id, availabilityData) => {
    const response = await api.post(
      `/api/v1/photographers/${id}/availability`,
      availabilityData,
    );
    return response.data;
  },
  getSlots: async (id, date) => {
    const response = await api.get(`/api/v1/photographers/${id}/slots`, {
      params: { date },
    });
    return response.data;
  },
};

export const packageService = {
  getPackages: async () => {
    const response = await api.get("/api/v1/packages");
    return response.data;
  },
  getAddons: async () => {
    const response = await api.get("/api/v1/packages/addons");
    return response.data;
  },
  createPackage: async (packageData) => {
    const response = await api.post("/api/v1/packages", packageData);
    return response.data;
  },
  updatePackage: async (id, packageData) => {
    const response = await api.put(`/api/v1/packages/${id}`, packageData);
    return response.data;
  },
  deletePackage: async (id) => {
    const response = await api.delete(`/api/v1/packages/${id}`);
    return response.data;
  },
};

export const sessionService = {
  getSessions: async (status = null) => {
    const response = await api.get("/api/v1/sessions", {
      params: status ? { status } : {},
    });
    return response.data;
  },
  getSession: async (id) => {
    const response = await api.get(`/api/v1/sessions/${id}`);
    return response.data;
  },
  bookSession: async (sessionData) => {
    const response = await api.post("/api/v1/sessions", sessionData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/v1/sessions/${id}/status`, {
      status,
    });
    return response.data;
  },
};

export const paymentService = {
  getPayments: async (sessionId = null) => {
    const response = await api.get("/api/v1/payments", {
      params: sessionId ? { session_id: sessionId } : {},
    });
    return response.data;
  },
  processPayment: async (paymentData) => {
    const response = await api.post("/api/v1/payments", paymentData);
    return response.data;
  },
};

export const photoshootService = {
  getPhotoshootRecords: async () => {
    const response = await api.get("/api/v1/photoshoots");
    return response.data;
  },
  getSessionRecord: async (sessionId) => {
    const response = await api.get(
      `/api/v1/sessions/${sessionId}/photoshoot-record`,
    );
    return response.data;
  },
  createOrUpdateRecord: async (sessionId, recordData) => {
    const response = await api.post(
      `/api/v1/sessions/${sessionId}/photoshoot-record`,
      recordData,
    );
    return response.data;
  },
};

export const featureService = {
  getFeatures: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/features", {
      params: { skip, limit },
    });
    return response.data;
  },
  getFeature: async (id) => {
    const response = await api.get(`/api/v1/features/${id}`);
    return response.data;
  },
  createFeature: async (featureData) => {
    const response = await api.post("/api/v1/features", featureData);
    return response.data;
  },
  updateFeature: async (id, featureData) => {
    const response = await api.put(`/api/v1/features/${id}`, featureData);
    return response.data;
  },
  deleteFeature: async (id) => {
    const response = await api.delete(`/api/v1/features/${id}`);
    return response.data;
  },
};

export const dashboardService = {
  getMetrics: async () => {
    const response = await api.get("/api/v1/dashboard/metrics");
    return response.data;
  },
  getStatusWidgets: async () => {
    const response = await api.get("/api/v1/dashboard/status-widgets");
    return response.data;
  },
};
