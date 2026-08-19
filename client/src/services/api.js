import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const assignTask = async (id, assignedToId) => {
  const response = await api.put(`/tasks/${id}/assign`, {
    assigned_to_id: assignedToId,
  });
  return response.data;
};

export const completeTask = async (id, completionData) => {
  const response = await api.put(`/tasks/${id}/complete`, completionData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const getTechnicians = async () => {
  const response = await api.get("/technicians");
  return response.data;
};

export const getCostSummary = async () => {
  const response = await api.get("/costs/summary");
  return response.data;
};

export default api;
