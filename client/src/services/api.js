import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  async getTodos(params = {}) {
    const response = await apiClient.get("/api/v1/todos", { params });
    return response.data;
  },

  async getTodo(todoId) {
    const response = await apiClient.get(
      `/api/v1/todos/${encodeURIComponent(todoId)}`,
    );
    return response.data;
  },

  async createTodo(todoData) {
    const response = await apiClient.post("/api/v1/todos", todoData);
    return response.data;
  },

  async updateTodo(todoId, updateData) {
    const response = await apiClient.put(
      `/api/v1/todos/${encodeURIComponent(todoId)}`,
      updateData,
    );
    return response.data;
  },

  async deleteTodo(todoId) {
    const response = await apiClient.delete(
      `/api/v1/todos/${encodeURIComponent(todoId)}`,
    );
    return response.data;
  },
};

export default api;
