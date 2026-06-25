import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to attach the bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getSavedCards = async () => {
  const response = await api.get("/api/v1/user/cards");
  return response.data;
};

export const savePaymentToken = async (cardData) => {
  const response = await api.post("/api/v1/payment/token", cardData);
  return response.data;
};

export const deleteSavedCard = async (cardId) => {
  const response = await api.delete(`/api/v1/user/cards/${cardId}`);
  return response.data;
};

export const chargePayment = async (chargeData) => {
  const response = await api.post("/api/v1/payment/charge", chargeData);
  return response.data;
};

// Mock authentication since backend doesn't have login endpoints
export const login = async (email, password) => {
  if (email === "test@example.com" && password === "testpassword") {
    const token = "00000000-0000-0000-0000-000000000000";
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_email", email);
    return { success: true, token, email };
  }
  throw new Error("Invalid email or password");
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_email");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token");
};

export const getLoggedInUserEmail = () => {
  return localStorage.getItem("user_email");
};

export default api;
