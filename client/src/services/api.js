import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/api/v1/auth/login", credentials);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};

export const productService = {
  getCategories: async () => {
    const response = await api.get("/api/v1/categories");
    return response.data;
  },
  getProducts: async (params = {}) => {
    const response = await api.get("/api/v1/products", { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/api/v1/products/${id}`);
    return response.data;
  },
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get("/api/v1/wishlist");
    return response.data;
  },
  addToWishlist: async (productId) => {
    const response = await api.post("/api/v1/wishlist", {
      product_id: productId,
    });
    return response.data;
  },
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/api/v1/wishlist/${productId}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get("/api/v1/cart");
    return response.data;
  },
  updateCart: async (productId, quantity) => {
    const response = await api.post("/api/v1/cart", {
      product_id: productId,
      quantity,
    });
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/api/v1/orders", orderData);
    return response.data;
  },
  getOrderById: async (id) => {
    const response = await api.get(`/api/v1/orders/${id}`);
    return response.data;
  },
};

export const adminService = {
  getMetrics: async () => {
    const response = await api.get("/api/v1/admin/metrics");
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get("/api/v1/admin/orders");
    return response.data;
  },
};

export default api;
