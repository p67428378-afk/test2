import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const getNotes = async (params = {}) => {
  const response = await api.get("/api/v1/notes", { params });
  return response.data;
};

export const getNote = async (id) => {
  const response = await api.get(`/api/v1/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post("/api/v1/notes", noteData);
  return response.data;
};

export const updateNote = async (id, noteData) => {
  const response = await api.put(`/api/v1/notes/${id}`, noteData);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await api.delete(`/api/v1/notes/${id}`);
  return response.data;
};

export const uploadAttachment = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post(`/api/v1/notes/${id}/attachments`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteAttachment = async (id) => {
  const response = await api.delete(`/api/v1/attachments/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/api/v1/stats");
  return response.data;
};

export const getAttachments = async () => {
  const response = await api.get("/api/v1/attachments");
  return response.data;
};

export const getTags = async () => {
  const response = await api.get("/api/v1/tags");
  return response.data;
};

export default api;
