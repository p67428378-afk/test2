import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
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
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const response = await api.post("/api/v1/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_email", email);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
  },
  getCurrentUserEmail: () => {
    return localStorage.getItem("user_email");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const subscriptionService = {
  createSubscription: async (boxSize, frequencyWeeks, paymentMethodToken) => {
    const response = await api.post("/api/v1/subscriptions", {
      box_size: boxSize,
      frequency_weeks: parseInt(frequencyWeeks, 10),
      payment_method_token: paymentMethodToken,
    });
    return response.data;
  },
  getMySubscription: async () => {
    const response = await api.get("/api/v1/subscriptions/me");
    return response.data;
  },
  updateSubscription: async (status, skipNext) => {
    const payload = {};
    if (status !== undefined) payload.status = status;
    if (skipNext !== undefined) payload.skip_next = skipNext;
    const response = await api.patch("/api/v1/subscriptions/me", payload);
    return response.data;
  },
  triggerWebhookPayment: async (subscriptionId, eventType, amount) => {
    const response = await api.post("/api/v1/webhooks/payment", {
      subscription_id: subscriptionId,
      event_type: eventType,
      amount: parseFloat(amount),
    });
    return response.data;
  },
};

export default api;
