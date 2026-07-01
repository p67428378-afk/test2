import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUser = async (username) => {
  try {
    const response = await api.post("/api/v1/users", { username });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getActivities = async (moduleName) => {
  try {
    const response = await api.get(`/api/v1/activities/${moduleName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching activities for ${moduleName}:`, error);
    throw error;
  }
};

export const saveProgress = async (
  userId,
  activityId,
  completed = true,
  score = 100,
) => {
  try {
    const response = await api.post("/api/v1/progress", {
      user_id: userId,
      activity_id: activityId,
      completed,
      score,
    });
    return response.data;
  } catch (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
};

export const getProgress = async (userId) => {
  try {
    const response = await api.get(`/api/v1/progress/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw error;
  }
};

export default api;
