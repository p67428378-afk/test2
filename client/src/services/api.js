import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    if (response.data?.access_token) {
      localStorage.setItem("auth_token", response.data.access_token);
      localStorage.setItem("user_info", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user_info");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },
};

export const noteService = {
  createNote: async (noteData) => {
    const response = await api.post("/api/v1/notes/", noteData);
    return response.data;
  },
  getNotes: async (params = {}) => {
    const response = await api.get("/api/v1/notes/", { params });
    return response.data;
  },
  getNoteById: async (id) => {
    const response = await api.get(`/api/v1/notes/${id}`);
    return response.data;
  },
  approveNote: async (id, reviewData = {}) => {
    const response = await api.post(`/api/v1/notes/${id}/approve`, reviewData);
    return response.data;
  },
  rejectNote: async (id, reviewData) => {
    const response = await api.post(`/api/v1/notes/${id}/reject`, reviewData);
    return response.data;
  },
};

export const reviewService = {
  getQueue: async (params = {}) => {
    const response = await api.get("/api/v1/reviews/queue", { params });
    return response.data;
  },
  getNoteReviews: async (noteId) => {
    const response = await api.get(`/api/v1/reviews/notes/${noteId}`);
    return response.data;
  },
};

export const searchService = {
  search: async (params = {}) => {
    const response = await api.get("/api/v1/search/", { params });
    return response.data;
  },
};

export const tagService = {
  getTags: async () => {
    const response = await api.get("/api/v1/tags/");
    return response.data;
  },
  createTag: async (tagData) => {
    const response = await api.post("/api/v1/tags/", tagData);
    return response.data;
  },
};

export default api;
