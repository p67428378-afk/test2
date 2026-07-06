import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTransactionDetails = async (id, token) => {
  const response = await api.get(`/api/v1/transactions/${id}/verify`, {
    params: { token },
  });
  return response.data;
};

export const submitTransactionAction = async (id, action, token) => {
  const response = await api.post(`/api/v1/transactions/${id}/action`, {
    action,
    token,
  });
  return response.data;
};

export default api;
