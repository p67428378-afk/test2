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
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getToken: () => localStorage.getItem("token"),
  getUser: () => {
    const u = localStorage.getItem("user");
    try {
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
};

export const recipeService = {
  getRecipes: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.category_id)
      queryParams.append("category_id", params.category_id);
    if (params.max_prep_time)
      queryParams.append("max_prep_time", params.max_prep_time);
    if (params.max_cook_time)
      queryParams.append("max_cook_time", params.max_cook_time);
    if (params.favorites_only) queryParams.append("favorites_only", "true");
    if (params.dietary_tags && Array.isArray(params.dietary_tags)) {
      params.dietary_tags.forEach((tag) =>
        queryParams.append("dietary_tags", tag),
      );
    }
    if (params.ingredients && Array.isArray(params.ingredients)) {
      params.ingredients.forEach((ing) =>
        queryParams.append("ingredients", ing),
      );
    }

    const url = `/api/v1/recipes${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  },
  getRecipe: async (id) => {
    const response = await api.get(`/api/v1/recipes/${id}`);
    return response.data;
  },
  createRecipe: async (data) => {
    const response = await api.post("/api/v1/recipes", data);
    return response.data;
  },
  updateRecipe: async (id, data) => {
    const response = await api.put(`/api/v1/recipes/${id}`, data);
    return response.data;
  },
  deleteRecipe: async (id) => {
    const response = await api.delete(`/api/v1/recipes/${id}`);
    return response.data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get("/api/v1/categories");
    return response.data;
  },
};

export const favoriteService = {
  addFavorite: async (userId, recipeId) => {
    const response = await api.post(
      `/api/v1/users/${userId}/favorites/${recipeId}`,
    );
    return response.data;
  },
  removeFavorite: async (userId, recipeId) => {
    const response = await api.delete(
      `/api/v1/users/${userId}/favorites/${recipeId}`,
    );
    return response.data;
  },
};

export default api;
