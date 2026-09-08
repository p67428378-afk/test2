import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Visitor Pre-approvals & QR
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

export const extendVisitorStay = async (visitorId, extensionMinutes = 120) => {
  const response = await apiClient.post(
    `/api/v1/visitors/${visitorId}/extend-stay`,
    { extension_minutes: extensionMinutes },
  );
  return response.data;
};

export const getVisitors = async () => {
  const response = await apiClient.get("/api/v1/visitors");
  return response.data;
};

// Deliveries
export const logDelivery = async (payload) => {
  const response = await apiClient.post("/api/v1/deliveries", payload);
  return response.data;
};

export const getDeliveries = async (unitNumber = null) => {
  const params = {};
  if (unitNumber) params.unit_number = unitNumber;
  const response = await apiClient.get("/api/v1/deliveries", { params });
  return response.data;
};

export const getOverdueDeliveries = async () => {
  const response = await apiClient.get("/api/v1/deliveries");
  const data = response.data || [];
  const now = new Date();
  // Filter items pending pickup for > 48 hours
  return data.filter((item) => {
    if (item.status !== "Pending Pickup") return false;
    const loggedAt = new Date(item.logged_at);
    const diffHours = (now - loggedAt) / (1000 * 60 * 60);
    return diffHours > 48;
  });
};

export const acknowledgePickup = async (deliveryId) => {
  const response = await apiClient.put(
    `/api/v1/deliveries/${deliveryId}/pickup`,
  );
  return response.data;
};

// Security Alerts
export const createSecurityAlert = async (payload) => {
  const response = await apiClient.post("/api/v1/alerts", payload);
  return response.data;
};

export const getSecurityAlerts = async (statusFilter = null) => {
  const params = statusFilter ? { status_filter: statusFilter } : {};
  const response = await apiClient.get("/api/v1/alerts", { params });
  return response.data;
};

export const cancelSecurityAlert = async (alertId, cancelReason) => {
  const response = await apiClient.post(`/api/v1/alerts/${alertId}/cancel`, {
    cancel_reason: cancelReason,
  });
  return response.data;
};

// Recurring Visitor Passes
export const getRecurringPasses = async () => {
  const response = await apiClient.get("/api/v1/visitors/recurring");
  return response.data;
};

export const createRecurringPass = async (payload) => {
  const response = await apiClient.post("/api/v1/visitors/recurring", payload);
  return response.data;
};

export const revokeRecurringPass = async (recurringPassId) => {
  const response = await apiClient.delete(
    `/api/v1/visitors/recurring/${recurringPassId}`,
  );
  return response.data;
};

// Overstay & Parking Slot Monitoring
export const getActiveOverstays = async () => {
  const response = await apiClient.get("/api/v1/visitors/overstay/active");
  return response.data;
};

export default apiClient;
