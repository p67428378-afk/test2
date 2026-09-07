import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const getGenres = async () => {
  try {
    const response = await apiClient.get("/api/v1/genres");
    return response.data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const generateNames = async ({
  genre = "general",
  quantity = 5,
  sub_tags = [],
}) => {
  try {
    const payload = {
      genre: genre.toLowerCase(),
      quantity: Number(quantity),
      sub_tags: sub_tags && sub_tags.length > 0 ? sub_tags : null,
    };
    const response = await apiClient.post("/api/v1/names/generate", payload);
    return response.data;
  } catch (error) {
    console.error("Error generating names:", error);
    throw error;
  }
};

export default apiClient;
