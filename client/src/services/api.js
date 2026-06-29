import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
});

// Add a request interceptor to inject the JWT token
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
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);
    const response = await api.post("/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    localStorage.setItem("user", JSON.stringify(response.data));
    return response.data;
  },
};

export const userService = {
  updateAvailability: async (isOnline) => {
    const response = await api.put(`/users/availability?is_online=${isOnline}`);
    return response.data;
  },
};

export const restaurantService = {
  list: async (cuisine = "", minRating = null) => {
    let url = "/restaurants";
    const params = [];
    if (cuisine) params.push(`cuisine=${encodeURIComponent(cuisine)}`);
    if (minRating !== null) params.push(`min_rating=${minRating}`);
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    const response = await api.get(url);
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
  addMenuItem: async (restaurantId, itemData) => {
    const response = await api.post(
      `/restaurants/${restaurantId}/menu`,
      itemData,
    );
    return response.data;
  },
  updateMenuItem: async (restaurantId, menuItemId, itemData) => {
    const response = await api.put(
      `/restaurants/${restaurantId}/menu/${menuItemId}`,
      itemData,
    );
    return response.data;
  },
  getAnalytics: async (restaurantId) => {
    const response = await api.get(`/restaurants/${restaurantId}/analytics`);
    return response.data;
  },
};

export const orderService = {
  create: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  list: async () => {
    const response = await api.get("/orders");
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

export const paymentService = {
  process: async (paymentData) => {
    const response = await api.post("/payments", paymentData);
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
};

export const adminService = {
  getMetrics: async () => {
    const response = await api.get("/admin/metrics");
    return response.data;
  },
  listUsers: async () => {
    const response = await api.get("/admin/users");
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
  refundOrder: async (id, reason) => {
    const response = await api.post(`/admin/orders/${id}/refund`, { reason });
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
  resolveTicket: async (id, resolution) => {
    const response = await api.put(`/admin/tickets/${id}/resolve`, {
      resolution,
    });
    return response.data;
  },
};

export default api;
