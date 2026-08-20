import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Apiaries
  getApiaries: async () => {
    const res = await apiClient.get("/api/v1/apiaries");
    return res.data;
  },
  createApiary: async (data) => {
    const res = await apiClient.post("/api/v1/apiaries", data);
    return res.data;
  },

  // Hives
  getHives: async (apiaryId, status) => {
    const params = {};
    if (apiaryId) params.apiary_id = apiaryId;
    if (status) params.status = status;
    const res = await apiClient.get("/api/v1/hives", { params });
    return res.data;
  },
  getHiveById: async (hiveId) => {
    const res = await apiClient.get(`/api/v1/hives/${hiveId}`);
    return res.data;
  },
  createHive: async (data) => {
    const res = await apiClient.post("/api/v1/hives", data);
    return res.data;
  },
  updateHive: async (hiveId, data) => {
    const res = await apiClient.patch(`/api/v1/hives/${hiveId}`, data);
    return res.data;
  },

  // Telemetry
  ingestTelemetry: async (data) => {
    const res = await apiClient.post("/api/v1/telemetry", data);
    return res.data;
  },
  getTelemetryLogs: async (hiveId, limit = 50) => {
    const params = { limit };
    if (hiveId) params.hive_id = hiveId;
    const res = await apiClient.get("/api/v1/telemetry", { params });
    return res.data;
  },

  // Harvests
  getHarvests: async (hiveId) => {
    const params = {};
    if (hiveId) params.hive_id = hiveId;
    const res = await apiClient.get("/api/v1/harvests", { params });
    return res.data;
  },
  createHarvest: async (data) => {
    const res = await apiClient.post("/api/v1/harvests", data);
    return res.data;
  },

  // Disease Reports
  getDiseaseReports: async (hiveId, severity) => {
    const params = {};
    if (hiveId) params.hive_id = hiveId;
    if (severity) params.severity = severity;
    const res = await apiClient.get("/api/v1/diseases/reports", { params });
    return res.data;
  },
  createDiseaseReport: async (data) => {
    const res = await apiClient.post("/api/v1/diseases/reports", data);
    return res.data;
  },

  // Inspections
  getInspections: async (hiveId, status) => {
    const params = {};
    if (hiveId) params.hive_id = hiveId;
    if (status) params.status_filter = status;
    const res = await apiClient.get("/api/v1/inspections", { params });
    return res.data;
  },
  createInspection: async (data) => {
    const res = await apiClient.post("/api/v1/inspections", data);
    return res.data;
  },
  updateInspection: async (inspectionId, data) => {
    const res = await apiClient.patch(
      `/api/v1/inspections/${inspectionId}`,
      data,
    );
    return res.data;
  },

  // Seasonal Analytics
  getSeasonalAnalytics: async (hiveId, season = "Summer", year) => {
    const params = { season };
    if (hiveId) params.hive_id = hiveId;
    if (year) params.year = year;
    const res = await apiClient.get("/api/v1/analytics/seasonal", { params });
    return res.data;
  },
};

export default api;
