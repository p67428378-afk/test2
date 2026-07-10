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

export default api;
