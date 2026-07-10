import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = async () => {
  const response = await api.get("/api/v1/tasks");
  return response.data;
};

export const createTask = async (text) => {
  const response = await api.post("/api/v1/tasks", { text });
  return response.data;
};

export const updateTask = async (taskId, updates) => {
  const response = await api.put(`/api/v1/tasks/${taskId}`, updates);
  return response.data;
};

export const deleteTask = async (taskId) => {
  await api.delete(`/api/v1/tasks/${taskId}`);
  return true;
};

export const reorderTasks = async (taskIds) => {
  const response = await api.put("/api/v1/tasks/reorder", {
    task_ids: taskIds,
  });
  return response.data;
};

export default api;
