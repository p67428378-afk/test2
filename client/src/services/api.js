import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get("/api/v1/products", { params });
    return response.data;
  },
  getProduct: async (productId) => {
    const response = await api.get(`/api/v1/products/${productId}`);
    return response.data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get("/api/v1/categories");
    return response.data;
  },
  getCategory: async (categoryId) => {
    const response = await api.get(`/api/v1/categories/${categoryId}`);
    return response.data;
  },
  getCategoryProducts: async (categoryId, params = {}) => {
    const response = await api.get(
      `/api/v1/categories/${categoryId}/products`,
      { params },
    );
    return response.data;
  },
};

export default api;
