import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data?.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
  },
};

export const tasksAPI = {
  listTasks: async (params = {}) => {
    const response = await api.get("/tasks", { params });
    return response.data;
  },
  createTask: async (taskData) => {
    const response = await api.post("/tasks", taskData);
    return response.data;
  },
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  assignTask: async (id, assigned_user_id) => {
    const response = await api.post(`/tasks/${id}/assign`, {
      assigned_user_id,
    });
    return response.data;
  },
  completeTask: async (id, completionData) => {
    const response = await api.post(`/tasks/${id}/complete`, completionData);
    return response.data;
  },
  getTaskLogs: async (id) => {
    const response = await api.get(`/tasks/${id}/logs`);
    return response.data;
  },
};

export const costsAPI = {
  getSummary: async (params = {}) => {
    const response = await api.get("/costs/summary", { params });
    return response.data;
  },
};

export const categoriesAPI = {
  listCategories: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },
};

export const usersAPI = {
  listUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export default api;
