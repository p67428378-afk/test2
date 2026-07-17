import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (login_id, password) => {
    const params = new URLSearchParams();
    params.append("login_id", login_id);
    params.append("password", password);
    const response = await api.post("/api/v1/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("username", login_id);
    }
    return response.data;
  },
  register: async (login_id, mobile_number, password) => {
    const params = new URLSearchParams();
    params.append("login_id", login_id);
    params.append("mobile_number", mobile_number);
    params.append("password", password);
    const response = await api.post("/api/v1/auth/register", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  getUsername: () => {
    return localStorage.getItem("username") || "";
  },
};

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get("/api/v1/wishlist");
    return response.data;
  },
  addToWishlist: async (productId) => {
    const response = await api.post("/api/v1/wishlist/items", {
      product_id: productId,
    });
    return response.data;
  },
  removeFromWishlist: async (itemId) => {
    const response = await api.delete(`/api/v1/wishlist/items/${itemId}`);
    return response.data;
  },
};

export default api;
