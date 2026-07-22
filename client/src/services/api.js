import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTasks = async (status = null, sort = "desc") => {
  const params = {};
  if (status) params.status = status;
  if (sort) params.sort = sort;

  const response = await api.get("/api/v1/tasks", { params });
  return response.data;
};

export const createTask = async (title, assignee = null) => {
  const response = await api.post("/api/v1/tasks", { title, assignee });
  return response.data;
};

export const updateTaskStatus = async (taskId, status, assignee = null) => {
  const response = await api.patch(`/api/v1/tasks/${taskId}`, {
    status,
    assignee,
  });
  return response.data;
};

export const getWebSocketUrl = () => {
  const wsProtocol = BASE_URL.startsWith("https") ? "wss" : "ws";
  const host = BASE_URL.replace(/^https?:\/\//, "");
  return `${wsProtocol}://${host}/ws/v1/worklist`;
};

export default api;
