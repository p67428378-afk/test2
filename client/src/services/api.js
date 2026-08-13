import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Stage & Artist Scheduling APIs
export const getStages = async () => {
  const res = await apiClient.get("/api/v1/stages");
  return res.data;
};

export const createStage = async (stageData) => {
  const res = await apiClient.post("/api/v1/stages", stageData);
  return res.data;
};

export const getArtists = async () => {
  const res = await apiClient.get("/api/v1/artists");
  return res.data;
};

export const createArtist = async (artistData) => {
  const res = await apiClient.post("/api/v1/artists", artistData);
  return res.data;
};

export const getStagePerformances = async (stageId) => {
  const res = await apiClient.get(`/api/v1/stages/${stageId}/performances`);
  return res.data;
};

export const createPerformance = async (stageId, performanceData) => {
  const res = await apiClient.post(
    `/api/v1/stages/${stageId}/performances`,
    performanceData,
  );
  return res.data;
};

export const updatePerformanceDelay = async (
  stageId,
  performanceId,
  delayMinutes,
  reason = "",
) => {
  const res = await apiClient.post(
    `/api/v1/stages/${stageId}/performances/${performanceId}/delay`,
    {
      delay_minutes: Number(delayMinutes),
      reason,
    },
  );
  return res.data;
};

export const getStageNotifications = async (stageId) => {
  const res = await apiClient.get(`/api/v1/stages/${stageId}/notifications`);
  return res.data;
};

// Volunteer Coordination APIs
export const getVolunteers = async () => {
  const res = await apiClient.get("/api/v1/volunteers");
  return res.data;
};

export const createVolunteer = async (volunteerData) => {
  const res = await apiClient.post("/api/v1/volunteers", volunteerData);
  return res.data;
};

export const getVolunteerShifts = async () => {
  const res = await apiClient.get("/api/v1/volunteers/shifts");
  return res.data;
};

export const createVolunteerShift = async (shiftData) => {
  const res = await apiClient.post("/api/v1/volunteers/shifts", shiftData);
  return res.data;
};

export const checkInVolunteerShift = async (shiftId, volunteerId = null) => {
  const res = await apiClient.post(
    `/api/v1/volunteers/shifts/${shiftId}/check-in`,
    {
      volunteer_id: volunteerId,
    },
  );
  return res.data;
};

export const dropVolunteerShift = async (shiftId, reason = "") => {
  const res = await apiClient.post(
    `/api/v1/volunteers/shifts/${shiftId}/drop`,
    {
      reason,
    },
  );
  return res.data;
};

export const getVolunteerAlerts = async () => {
  const res = await apiClient.get("/api/v1/volunteers/alerts");
  return res.data;
};

// Ticket Validation APIs
export const validateTicket = async (qrPayload, gateId) => {
  const res = await apiClient.post("/api/v1/tickets/validate", {
    qr_payload: qrPayload,
    gate_id: gateId,
    device_timestamp: new Date().toISOString(),
  });
  return res.data;
};

export const syncOfflineTickets = async (deviceId, scans) => {
  const res = await apiClient.post("/api/v1/tickets/sync", {
    device_id: deviceId,
    scans,
  });
  return res.data;
};

export const getTickets = async () => {
  const res = await apiClient.get("/api/v1/tickets");
  return res.data;
};

export const createTicket = async (ticketData) => {
  const res = await apiClient.post("/api/v1/tickets", ticketData);
  return res.data;
};

// Crowd Analytics APIs
export const getCrowdAnalytics = async () => {
  const res = await apiClient.get("/api/v1/analytics/crowd");
  return res.data;
};

export const ingestCrowdTelemetry = async (telemetryData) => {
  const res = await apiClient.post(
    "/api/v1/analytics/crowd/telemetry",
    telemetryData,
  );
  return res.data;
};
