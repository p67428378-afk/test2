import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAnimals = async (name = "") => {
  try {
    const response = await api.get("/api/v1/animals", {
      params: name ? { name } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};

export const getAnimalById = async (animalId) => {
  try {
    const response = await api.get(`/api/v1/animals/${animalId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching animal ${animalId}:`, error);
    throw error;
  }
};

export const getEnclosures = async () => {
  try {
    const response = await api.get("/api/v1/enclosures");
    return response.data;
  } catch (error) {
    console.error("Error fetching enclosures:", error);
    throw error;
  }
};

export const getMapData = async () => {
  try {
    const response = await api.get("/api/v1/map");
    return response.data;
  } catch (error) {
    console.error("Error fetching map data:", error);
    throw error;
  }
};

export default api;
