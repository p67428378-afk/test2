import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Product Catalog
  async getProducts(params = {}) {
    const response = await apiClient.get("/api/v1/products", { params });
    return response.data;
  },

  async getProductById(productId) {
    const response = await apiClient.get(`/api/v1/products/${productId}`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await apiClient.post("/api/v1/products", productData);
    return response.data;
  },

  // User Preferences
  async savePreferences(preferenceData) {
    const response = await apiClient.post(
      "/api/v1/preferences",
      preferenceData,
    );
    return response.data;
  },

  async getPreferences(userId) {
    const response = await apiClient.get(`/api/v1/preferences/${userId}`);
    return response.data;
  },

  // AI Recommendations
  async generateRecommendations(data) {
    const response = await apiClient.post(
      "/api/v1/recommendations/generate",
      data,
    );
    return response.data;
  },

  async submitFeedback(feedbackData) {
    const response = await apiClient.post(
      "/api/v1/recommendations/feedback",
      feedbackData,
    );
    return response.data;
  },

  // Health check
  async checkHealth() {
    const response = await apiClient.get("/api/v1/health");
    return response.data;
  },
};

export default api;
