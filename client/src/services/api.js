import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Fetch aggregate cost summary for dashboard
  getCostSummary: async (params = {}) => {
    const cleanParams = {};
    if (params.start_date) cleanParams.start_date = params.start_date;
    if (params.end_date) cleanParams.end_date = params.end_date;
    if (params.location) cleanParams.location = params.location;

    const response = await apiClient.get("/api/v1/maintenance-events/summary", {
      params: cleanParams,
    });
    return response.data;
  },

  // List maintenance logs with filtering and pagination
  getMaintenanceEvents: async (params = {}) => {
    const cleanParams = {
      skip: params.skip || 0,
      limit: params.limit || 20,
    };
    if (params.search) cleanParams.search = params.search;
    if (params.location) cleanParams.location = params.location;
    if (params.maintenance_type)
      cleanParams.maintenance_type = params.maintenance_type;
    if (params.start_date) cleanParams.start_date = params.start_date;
    if (params.end_date) cleanParams.end_date = params.end_date;
    if (
      params.min_cost !== undefined &&
      params.min_cost !== "" &&
      params.min_cost !== null
    ) {
      cleanParams.min_cost = params.min_cost;
    }
    if (
      params.max_cost !== undefined &&
      params.max_cost !== "" &&
      params.max_cost !== null
    ) {
      cleanParams.max_cost = params.max_cost;
    }

    const response = await apiClient.get("/api/v1/maintenance-events", {
      params: cleanParams,
    });
    return response.data;
  },

  // Get single event by ID
  getMaintenanceEventById: async (id) => {
    const response = await apiClient.get(`/api/v1/maintenance-events/${id}`);
    return response.data;
  },

  // Create new maintenance event
  createMaintenanceEvent: async (data) => {
    const response = await apiClient.post("/api/v1/maintenance-events", data);
    return response.data;
  },

  // Update existing maintenance event
  updateMaintenanceEvent: async (id, data) => {
    const response = await apiClient.put(
      `/api/v1/maintenance-events/${id}`,
      data,
    );
    return response.data;
  },

  // Delete maintenance event
  deleteMaintenanceEvent: async (id) => {
    const response = await apiClient.delete(`/api/v1/maintenance-events/${id}`);
    return response.data;
  },

  // Export maintenance events to CSV
  exportMaintenanceCsv: async (params = {}) => {
    const cleanParams = {};
    if (params.start_date) cleanParams.start_date = params.start_date;
    if (params.end_date) cleanParams.end_date = params.end_date;
    if (params.location) cleanParams.location = params.location;
    if (params.maintenance_type)
      cleanParams.maintenance_type = params.maintenance_type;

    const response = await apiClient.get("/api/v1/maintenance-events/export", {
      params: cleanParams,
      responseType: "blob",
    });
    return response.data;
  },
};

export default api;
