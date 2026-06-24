import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getBooks = async (search = "", skip = 0, limit = 20) => {
  const params = { skip, limit };
  if (search) {
    params.search = search;
  }
  const response = await api.get("/books", { params });
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post("/books", bookData);
  return response.data;
};

export default api;
