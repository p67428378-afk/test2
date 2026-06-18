import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFXRates = async (sourceCurrency, targetCurrency, amount) => {
  const response = await api.get("/api/v1/fx-rates", {
    params: {
      source_currency: sourceCurrency,
      target_currency: targetCurrency,
      amount,
    },
  });
  return response.data;
};

export const createPayment = async (paymentData) => {
  const response = await api.post("/api/v1/payments", paymentData);
  return response.data;
};

export const getPayments = async (params = {}) => {
  const response = await api.get("/api/v1/payments", { params });
  return response.data;
};

export const getPaymentDetail = async (paymentId) => {
  const response = await api.get(`/api/v1/payments/${paymentId}`);
  return response.data;
};

export const retryPayment = async (paymentId) => {
  const response = await api.post(`/api/v1/payments/${paymentId}/retry`);
  return response.data;
};

export const getComplianceReports = async (params = {}) => {
  const response = await api.get("/api/v1/compliance/reports", { params });
  return response.data;
};

export default api;
