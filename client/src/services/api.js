import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const joinQueue = async (customerName, serviceType) => {
  const response = await api.post("/api/v1/queue/tickets", {
    customer_name: customerName,
    service_type: serviceType,
  });
  return response.data;
};

export const getTicketStatus = async (ticketId) => {
  const response = await api.get(`/api/v1/queue/tickets/${ticketId}`);
  return response.data;
};

export const getQueueTickets = async (
  statusFilter = null,
  skip = 0,
  limit = 50,
) => {
  const params = {};
  if (statusFilter && statusFilter !== "All") {
    params.status = statusFilter;
  }
  params.skip = skip;
  params.limit = limit;

  const response = await api.get("/api/v1/queue/tickets", { params });
  return response.data;
};

export const updateTicketStatus = async (
  ticketId,
  status,
  counterNumber = null,
) => {
  const payload = { status };
  if (counterNumber) {
    payload.counter_number = counterNumber;
  }
  const response = await api.patch(
    `/api/v1/queue/tickets/${ticketId}/status`,
    payload,
  );
  return response.data;
};

export default api;
