import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFDProducts = async () => {
  const response = await api.get("/api/v1/fd-products");
  return response.data;
};

export const getAccountDetails = async (accountId) => {
  const response = await api.get(`/api/v1/accounts/${accountId}`);
  return response.data;
};

export const createFD = async (payload) => {
  const response = await api.post("/api/v1/fds", payload);
  return response.data;
};

export default api;
