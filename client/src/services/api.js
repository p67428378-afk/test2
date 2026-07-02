import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach mock JWT token for testing/demo purposes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || "mock-jwt-token-123";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDashboard = async () => {
  const response = await api.get("/api/v1/recharge/dashboard");
  return response.data;
};

export const validateOperator = async (accountNumber, operatorName) => {
  const response = await api.post("/api/v1/recharge/validate-operator", {
    account_number: accountNumber,
    operator_name: operatorName,
  });
  return response.data;
};

export const processRecharge = async (accountNumber, operatorName, amount) => {
  const response = await api.post("/api/v1/recharge", {
    account_number: accountNumber,
    operator_name: operatorName,
    amount: parseFloat(amount),
  });
  return response.data;
};

export default api;
