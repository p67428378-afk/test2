import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCourses = async (skip = 0, limit = 20) => {
  const response = await api.get("/api/v1/courses", {
    params: { skip, limit },
  });
  return response.data;
};

export default api;
