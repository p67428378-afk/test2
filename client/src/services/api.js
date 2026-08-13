import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const authApi = {
  login: async (email, password) => {
    const response = await api.post("/auth/login/json", { email, password });
    return response.data;
  },
  register: async (email, password, role = "CUSTOMER") => {
    const response = await api.post("/auth/register", {
      email,
      password,
      role,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const bookingsApi = {
  create: async (bookingData) => {
    const response = await api.post("/bookings", bookingData);
    return response.data;
  },
  list: async (statusFilter) => {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await api.get("/bookings", { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },
};

export const dispatchApi = {
  assign: async (bookingId, driverId, tankerId) => {
    const response = await api.post("/dispatch/assign", {
      booking_id: bookingId,
      driver_id: driverId,
      tanker_id: tankerId,
    });
    return response.data;
  },
};

export const deliveriesApi = {
  updateStatus: async (bookingId, status) => {
    const response = await api.patch(`/deliveries/${bookingId}/status`, {
      status,
    });
    return response.data;
  },
};

export const adminApi = {
  getAnalytics: async () => {
    const response = await api.get("/admin/analytics");
    return response.data;
  },
};

export const tankersApi = {
  list: async (statusFilter) => {
    const params = statusFilter ? { status: statusFilter } : {};
    const response = await api.get("/tankers", { params });
    return response.data;
  },
};

export const usersApi = {
  listByRole: async (roleFilter) => {
    const params = roleFilter ? { role: roleFilter } : {};
    const response = await api.get("/users", { params });
    return response.data;
  },
};

export default api;
