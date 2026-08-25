import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const api = {
  getTodos: async (params = {}) => {
    const cleanParams = {};
    if (params.completed !== undefined && params.completed !== null) {
      cleanParams.completed = params.completed;
    }
    if (params.search && params.search.trim()) {
      cleanParams.search = params.search.trim();
    }
    if (params.skip !== undefined) cleanParams.skip = params.skip;
    if (params.limit !== undefined) cleanParams.limit = params.limit;

    const response = await apiClient.get("/todos", { params: cleanParams });
    return response.data;
  },

  createTodo: async (data) => {
    const payload = {
      title: data.title,
      description: data.description || null,
    };
    const response = await apiClient.post("/todos", payload);
    return response.data;
  },

  getTodoById: async (id) => {
    const response = await apiClient.get(`/todos/${id}`);
    return response.data;
  },

  updateTodo: async (id, data) => {
    const payload = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.completed !== undefined) payload.completed = data.completed;

    const response = await apiClient.put(`/todos/${id}`, payload);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await apiClient.delete(`/todos/${id}`);
    return response.data;
  },

  checkHealth: async () => {
    const response = await axios.get(`${BASE_URL}/health`, { timeout: 5000 });
    return response.data;
  },
};

export default api;
