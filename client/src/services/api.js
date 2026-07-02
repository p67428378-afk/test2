import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to inject JWT token
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
    // OAuth2PasswordRequestForm expects x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append("username", email);
    params.append("password", password);

    const response = await api.post("/api/v1/auth/login", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  register: async (email, password, fullName, role = "customer") => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      full_name: fullName,
      role,
    });
    return response.data;
  },
};

export const shipmentService = {
  createShipment: async (shipmentData) => {
    const response = await api.post("/api/v1/shipments", shipmentData);
    return response.data;
  },

  listShipments: async (skip = 0, limit = 20) => {
    const response = await api.get("/api/v1/shipments", {
      params: { skip, limit },
    });
    return response.data;
  },

  trackShipment: async (trackingId) => {
    const response = await api.get(`/api/v1/shipments/${trackingId}`);
    return response.data;
  },
};

export const adminService = {
  addAgent: async (agentData) => {
    const response = await api.post("/api/v1/admin/agents", agentData);
    return response.data;
  },

  listAgents: async () => {
    const response = await api.get("/api/v1/admin/agents");
    return response.data;
  },

  assignAgent: async (shipmentId, agentId) => {
    const response = await api.post(
      `/api/v1/admin/shipments/${shipmentId}/assign`,
      {
        agent_id: agentId,
      },
    );
    return response.data;
  },

  updateStatus: async (shipmentId, statusData) => {
    const response = await api.post(
      `/api/v1/admin/shipments/${shipmentId}/status`,
      statusData,
    );
    return response.data;
  },
};

export default api;
