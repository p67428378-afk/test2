import axios from "axios";

const getBaseUrl = () => {
  if (
    typeof import.meta.env !== "undefined" &&
    import.meta.env.VITE_API_BASE_URL
  ) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return "http://localhost:8000";
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getGreetings = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get("/api/v1/greetings", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
