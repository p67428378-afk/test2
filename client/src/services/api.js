import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Generate a simple session ID for the cart
const getSessionId = () => {
  let sessionId = localStorage.getItem("hogwarts_session_id");
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substring(2, 15);
    localStorage.setItem("hogwarts_session_id", sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Session-ID": getSessionId(),
  },
});

export const booksApi = {
  list: async (params = {}) => {
    const response = await api.get("/api/v1/books", { params });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/api/v1/books/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/api/v1/books", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/api/v1/books/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/books/${id}`);
    return response.data;
  },
};

export const cartApi = {
  get: async () => {
    const response = await api.get("/api/v1/cart");
    return response.data;
  },
  add: async (bookId, quantity) => {
    const response = await api.post("/api/v1/cart", {
      book_id: bookId,
      quantity,
    });
    return response.data;
  },
  remove: async (bookId) => {
    const response = await api.delete(`/api/v1/cart/${bookId}`);
    return response.data;
  },
};

export const ordersApi = {
  create: async (orderData) => {
    const response = await api.post("/api/v1/orders", orderData);
    return response.data;
  },
};

export const passwordResetApi = {
  initiate: async (data) => {
    const response = await api.post("/api/v1/password-reset/initiate", data);
    return response.data;
  },
  verifyOtp: async (data) => {
    const response = await api.post("/api/v1/password-reset/verify-otp", data);
    return response.data;
  },
  verifySecurityQuestion: async (data) => {
    const response = await api.post(
      "/api/v1/password-reset/verify-security-question",
      data,
    );
    return response.data;
  },
  setNewPassword: async (data) => {
    const response = await api.post(
      "/api/v1/password-reset/set-new-password",
      data,
    );
    return response.data;
  },
};

export default api;
