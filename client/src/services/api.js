import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token
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
      localStorage.setItem("email", email);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  },
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const membershipService = {
  getAll: async () => {
    const response = await api.get("/api/v1/memberships");
    return response.data;
  },
  create: async (gymName, membershipType, monthlyFee) => {
    const response = await api.post("/api/v1/memberships", {
      gym_name: gymName,
      membership_type: membershipType,
      monthly_fee: parseFloat(monthlyFee),
    });
    return response.data;
  },
};

export const visitService = {
  getAll: async (membershipId = null) => {
    const params = membershipId ? { membership_id: membershipId } : {};
    const response = await api.get("/api/v1/visits", { params });
    return response.data;
  },
  create: async (membershipId, visitDate) => {
    const response = await api.post("/api/v1/visits", {
      membership_id: membershipId,
      visit_date: visitDate,
    });
    return response.data;
  },
};

export const analysisService = {
  getAnalysis: async () => {
    const response = await api.get("/api/v1/analysis");
    return response.data;
  },
};

export const notificationService = {
  configure: async (
    inactiveDaysThreshold,
    costPerVisitThreshold,
    emailNotificationsEnabled,
  ) => {
    const response = await api.post("/api/v1/notifications/configure", {
      inactive_days_threshold: inactiveDaysThreshold
        ? parseInt(inactiveDaysThreshold)
        : null,
      cost_per_visit_threshold: costPerVisitThreshold
        ? parseFloat(costPerVisitThreshold)
        : null,
      email_notifications_enabled: emailNotificationsEnabled,
    });
    return response.data;
  },
};

export default api;
