import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (email, password) => {
    const response = await api.post("/api/v1/users/register", {
      email,
      password,
    });
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post("/api/v1/users/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return { email: payload.sub || payload.email };
    } catch (error) {
      return null;
    }
  },
  // Password Reset Flow
  initiateReset: async (email) => {
    const response = await api.post("/api/v1/password-reset/initiate", {
      email,
    });
    return response.data;
  },
  verifyOtp: async (otp, sessionId) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", {
      otp,
      password_reset_session_id: sessionId,
    });
    return response.data;
  },
  verifySecurityQuestion: async (answer, sessionId) => {
    const response = await api.post(
      "/api/v1/password-reset/verify-security-question",
      {
        answer,
        security_question_session_id: sessionId,
      },
    );
    return response.data;
  },
  setNewPassword: async (newPassword, sessionId) => {
    const response = await api.post("/api/v1/password-reset/set-new-password", {
      new_password: newPassword,
      password_reset_session_id: sessionId,
    });
    return response.data;
  },
};

export const productService = {
  getProducts: async (category = "") => {
    const params = {};
    if (category && category !== "All") {
      params.category = category;
    }
    const response = await api.get("/api/v1/products", { params });
    return response.data;
  },
  getProductDetails: async (productId) => {
    const response = await api.get(`/api/v1/products/${productId}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async () => {
    const response = await api.get("/api/v1/cart");
    return response.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post("/api/v1/cart", {
      product_id: productId,
      quantity,
    });
    return response.data;
  },
};

export const orderService = {
  createOrder: async (shippingAddress, paymentMethodId = "pm_mock_123") => {
    const response = await api.post("/api/v1/orders", {
      shipping_address: shippingAddress,
      payment_method_id: paymentMethodId,
    });
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get("/api/v1/orders");
    return response.data;
  },
};

export default api;
