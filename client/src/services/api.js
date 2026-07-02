import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getNotifications = async () => {
  const response = await api.get("/api/v1/notifications");
  return response.data;
};

export const respondToTransaction = async (
  notificationId,
  transactionId,
  decision,
) => {
  const response = await api.post("/api/v1/transaction-responses", {
    notification_id: notificationId,
    transaction_id: transactionId,
    decision: decision,
  });
  return response.data;
};

export default api;
