import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createVisitorPreApproval = async (payload) => {
  const response = await apiClient.post(
    "/api/v1/visitors/pre-approval",
    payload,
  );
  return response.data;
};

export const getVisitorPreApprovals = async (unitNumber = null) => {
  const params = unitNumber ? { unit_number: unitNumber } : {};
  const response = await apiClient.get("/api/v1/visitors/pre-approval", {
    params,
  });
  return response.data;
};

export const validateQREntry = async (payload) => {
  const response = await apiClient.post(
    "/api/v1/visitors/qr/validate",
    payload,
  );
  return response.data;
};

export const logDelivery = async (payload) => {
  const response = await apiClient.post("/api/v1/deliveries", payload);
  return response.data;
};

export const getDeliveries = async (unitNumber = null, status = null) => {
  const params = {};
  if (unitNumber) params.unit_number = unitNumber;
  if (status) params.status = status;
  const response = await apiClient.get("/api/v1/deliveries", { params });
  return response.data;
};

export const getOverdueDeliveries = async () => {
  const response = await apiClient.get("/api/v1/deliveries/overdue");
  return response.data;
};

export const collectDelivery = async (deliveryId, notes = "") => {
  const response = await apiClient.post(
    `/api/v1/deliveries/${deliveryId}/collect`,
    { notes },
  );
  return response.data;
};

export const createSecurityAlert = async (payload) => {
  const response = await apiClient.post("/api/v1/alerts", payload);
  return response.data;
};

export const getSecurityAlerts = async (statusFilter = null) => {
  const params = statusFilter ? { status: statusFilter } : {};
  const response = await apiClient.get("/api/v1/alerts", { params });
  return response.data;
};

export const cancelSecurityAlert = async (alertId, cancellationReason) => {
  const response = await apiClient.post(`/api/v1/alerts/${alertId}/cancel`, {
    cancellation_reason: cancellationReason,
  });
  return response.data;
};

export default apiClient;
