import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const dashboardService = {
  getRealtime: async () => {
    try {
      const response = await api.get("/api/v1/dashboard/realtime");
      return response.data;
    } catch (error) {
      console.error("Error fetching realtime dashboard data:", error);
      throw error;
    }
  },
};

export const analyticsService = {
  getHistory: async (startDate, endDate, source = "") => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (source) params.source = source;

      const response = await api.get("/api/v1/analytics/history", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching historical analytics data:", error);
      throw error;
    }
  },
};

export const serviceRequestsService = {
  getAll: async (status = "") => {
    try {
      const params = {};
      if (status) params.status = status;
      const response = await api.get("/api/v1/service-requests", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching service requests:", error);
      throw error;
    }
  },
  create: async (data) => {
    try {
      const response = await api.post("/api/v1/service-requests", data);
      return response.data;
    } catch (error) {
      console.error("Error creating service request:", error);
      throw error;
    }
  },
  update: async (id, data) => {
    try {
      const response = await api.put(`/api/v1/service-requests/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating service request:", error);
      throw error;
    }
  },
};

export default api;
