import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
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
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (email, password, fullName, phone, role) => {
    const response = await api.post("/auth/register", {
      email,
      password,
      full_name: fullName,
      phone,
      role,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/users/me");
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

export const restaurantService = {
  list: async (cuisine = "", minRating = null) => {
    const params = {};
    if (cuisine) params.cuisine = cuisine;
    if (minRating !== null) params.min_rating = minRating;
    const response = await api.get("/restaurants", { params });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },
  create: async (restaurantData) => {
    const response = await api.post("/restaurants", restaurantData);
    return response.data;
  },
  update: async (id, restaurantData) => {
    const response = await api.put(`/restaurants/${id}`, restaurantData);
    return response.data;
  },
  addMenuItem: async (id, itemData) => {
    const response = await api.post(`/restaurants/${id}/menu`, itemData);
    return response.data;
  },
  updateMenuItem: async (id, menuItemId, itemData) => {
    const response = await api.put(
      `/restaurants/${id}/menu/${menuItemId}`,
      itemData,
    );
    return response.data;
  },
  getAnalytics: async (id) => {
    const response = await api.get(`/restaurants/${id}/analytics`);
    return response.data;
  },
};

export const orderService = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  list: async (role, statusFilter = "") => {
    const params = { role };
    if (statusFilter) params.status_filter = statusFilter;
    const response = await api.get("/orders", { params });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },
  submitFeedback: async (id, rating, feedback) => {
    const response = await api.post(`/orders/${id}/feedback`, {
      rating,
      feedback,
    });
    return response.data;
  },
};

export const deliveryService = {
  listAvailable: async () => {
    const response = await api.get("/deliveries/available");
    return response.data;
  },
  accept: async (id) => {
    const response = await api.put(`/deliveries/${id}/accept`);
    return response.data;
  },
  updateLocation: async (id, latitude, longitude) => {
    const response = await api.put(`/deliveries/${id}/location`, {
      latitude,
      longitude,
    });
    return response.data;
  },
  get: async (id) => {
    const response = await api.get(`/deliveries/${id}`);
    return response.data;
  },
  updateAvailability: async (isOnline) => {
    const response = await api.put(`/users/availability?is_online=${isOnline}`);
    return response.data;
  },
};

export const adminService = {
  getMetrics: async () => {
    const response = await api.get("/admin/metrics");
    return response.data;
  },
  listUsers: async (role = "") => {
    const params = {};
    if (role) params.role = role;
    const response = await api.get("/admin/users", { params });
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  processRefund: async (orderId) => {
    const response = await api.post(`/admin/orders/${orderId}/refund`);
    return response.data;
  },
  listTickets: async () => {
    const response = await api.get("/admin/tickets");
    return response.data;
  },
  createTicket: async (ticketData) => {
    const response = await api.post("/admin/tickets", ticketData);
    return response.data;
  },
  resolveTicket: async (id) => {
    const response = await api.put(`/admin/tickets/${id}/resolve`);
    return response.data;
  },
};

export default api;
