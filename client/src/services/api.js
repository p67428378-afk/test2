import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getScheduleSlots = async () => {
  const response = await api.get("/api/v1/schedule");
  return response.data;
};

export const createScheduleSlot = async (slotData) => {
  const response = await api.post("/api/v1/schedule", slotData);
  return response.data;
};

export const updateScheduleSlot = async (slotId, slotData) => {
  const response = await api.put(`/api/v1/schedule/${slotId}`, slotData);
  return response.data;
};

export const deleteScheduleSlot = async (slotId) => {
  await api.delete(`/api/v1/schedule/${slotId}`);
};

export default api;
