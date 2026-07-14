import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const uploadDamagePhotos = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await api.post("/api/v1/claims/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getClaimEstimate = async (claimId) => {
  const response = await api.get(`/api/v1/claims/${claimId}/estimate`);
  return response.data;
};

export const requestTowDispatch = async (
  claimId,
  latitude,
  longitude,
  idempotencyKey,
) => {
  const headers = {};
  if (idempotencyKey) {
    headers["Idempotency-Key"] = idempotencyKey;
  }
  const response = await api.post(
    "/api/v1/claims/dispatch/request_tow",
    {
      claim_id: claimId,
      gps_latitude: latitude,
      gps_longitude: longitude,
    },
    { headers },
  );
  return response.data;
};

export const getDispatchStatus = async (dispatchId) => {
  const response = await api.get(
    `/api/v1/claims/dispatch/${dispatchId}/status`,
  );
  return response.data;
};

export const cancelTowDispatch = async (dispatchId) => {
  const response = await api.post(
    `/api/v1/claims/dispatch/${dispatchId}/cancel`,
  );
  return response.data;
};

export const getActiveIncident = async () => {
  const response = await api.get("/api/v1/claims/active_incident");
  return response.data;
};

export default api;
