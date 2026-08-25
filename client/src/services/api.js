import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const searchCities = async (query) => {
  try {
    const response = await api.get(
      `/api/v1/weather/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error searching cities:", error);
    throw error;
  }
};

export const getWeatherForecast = async (lat, lon, units = "metric") => {
  try {
    const response = await api.get(
      `/api/v1/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
};

export default api;
