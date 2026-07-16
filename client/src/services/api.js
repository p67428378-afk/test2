import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProperties = async (location = "", skip = 0, limit = 20) => {
  const params = {};
  if (location) {
    params.location = location;
  }
  params.skip = skip;
  params.limit = limit;

  const response = await api.get("/api/v1/properties", { params });
  return response.data;
};

export const getPropertyDetails = async (propertyId) => {
  const response = await api.get(`/api/v1/properties/${propertyId}`);
  return response.data;
};

export const submitContactForm = async (contactData) => {
  const response = await api.post("/api/v1/contacts", contactData);
  return response.data;
};

export default api;
