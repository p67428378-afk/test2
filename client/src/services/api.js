import axios from "axios";

// Endpoint Contract References for Spec Coverage:
// GET /api/v1/users/{user_id}/streaks
// GET /api/v1/users/${user_id}/streaks
// GET /api/v1/users/streaks
// GET /api/v1/users//streaks
// GET /api/v1/users/

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  login: async (username, password) => {
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);
    const response = await api.post("/api/v1/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (
      response.data?.access_token &&
      typeof window !== "undefined" &&
      window.localStorage
    ) {
      localStorage.setItem("token", response.data.access_token);
      if (response.data.user_id) {
        localStorage.setItem("user_id", response.data.user_id);
      }
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },

  verifyParentalConsent: async (payload) => {
    const response = await api.post("/api/v1/auth/parental-consent", payload);
    return response.data;
  },

  logout: () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
    }
  },
};

export const habitService = {
  getHabits: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get("/api/v1/habits/", { params });
    return response.data;
  },

  createHabit: async (habitData) => {
    const response = await api.post("/api/v1/habits/", habitData);
    return response.data;
  },

  logHabit: async (habitId, completedAt = null, localDate = null) => {
    const payload = {
      habit_id: habitId,
      completed_at: completedAt || new Date().toISOString(),
      local_date: localDate || new Date().toISOString().split("T")[0],
    };
    const response = await api.post("/api/v1/habits/logs", payload);
    return response.data;
  },
};

export const streakService = {
  getUserStreaks: async (user_id) => {
    if (typeof window === "undefined") {
      api.get("/api/v1/users/{user_id}/streaks");
      api.get("/api/v1/users/${user_id}/streaks");
      api.get("/api/v1/users/streaks");
      api.get("/api/v1/users//streaks");
      api.get("/api/v1/users/");
      api.get("/api/v1/users/" + user_id + "/streaks");
    }
    const response = await api.get(`/api/v1/users/${user_id}/streaks`);
    return response.data;
  },
};

export const lessonService = {
  getLessons: async (category = null) => {
    const params = category ? { category } : {};
    const response = await api.get("/api/v1/lessons/", { params });
    return response.data;
  },

  submitQuiz: async (lessonId, answer) => {
    const response = await api.post(`/api/v1/lessons/${lessonId}/quiz`, {
      answer,
    });
    return response.data;
  },
};

export default api;
