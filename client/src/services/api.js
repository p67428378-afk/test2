import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);
    const response = await api.post("/api/v1/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (response.data && response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/api/v1/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/api/v1/auth/me");
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
  },
};

export const ordersAPI = {
  createOrder: async (orderData) => {
    const response = await api.post("/api/v1/orders", orderData);
    return response.data;
  },
  getOrders: async (params = {}) => {
    const response = await api.get("/api/v1/orders", { params });
    return response.data;
  },
  getOrderById: async (orderId) => {
    const response = await api.get(`/api/v1/orders/${orderId}`);
    return response.data;
  },
  updateStage: async (orderId, stageData) => {
    const response = await api.patch(
      `/api/v1/orders/${orderId}/stage`,
      stageData,
    );
    return response.data;
  },
};

export const pickupsAPI = {
  getPickups: async (params = {}) => {
    const response = await api.get("/api/v1/pickups", { params });
    return response.data;
  },
  schedulePickup: async (pickupData) => {
    const response = await api.post("/api/v1/pickups", pickupData);
    return response.data;
  },
};

export const routesAPI = {
  getDriverRoutes: async (driverId, zone = null) => {
    const params = zone ? { zone } : {};
    const response = await api.get(`/api/v1/routes/driver/${driverId}`, {
      params,
    });
    return response.data;
  },
  updateStopStatus: async (stopId, statusData) => {
    const response = await api.patch(
      `/api/v1/routes/stops/${stopId}`,
      statusData,
    );
    return response.data;
  },
  createRoute: async (routeData) => {
    const response = await api.post("/api/v1/routes", routeData);
    return response.data;
  },
};

export const paymentsAPI = {
  createCheckoutSession: async (sessionData) => {
    const response = await api.post(
      "/api/v1/payments/checkout-session",
      sessionData,
    );
    return response.data;
  },
};

export default api;
