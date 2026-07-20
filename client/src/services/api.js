import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchBooks = async (params) => {
  try {
    const response = await api.get("/api/v1/books/search", { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await api.post("/api/v1/books", bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
