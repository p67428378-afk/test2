import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach token
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
    const response = await api.post("/api/v1/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (email, password, fullName, role = "staff") => {
    const response = await api.post("/api/v1/auth/register", {
      email,
      password,
      full_name: fullName,
      role,
    });
    return response.data;
  },
  me: async () => {
    const response = await api.get("/api/v1/auth/me");
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

export const itemService = {
  list: async (skip = 0, limit = 100, search = "", category = "") => {
    const params = { skip, limit };
    if (search) params.search = search;
    if (category) params.category = category;
    const response = await api.get("/api/v1/items", { params });
    return response.data;
  },
  create: async (itemData) => {
    const response = await api.post("/api/v1/items", itemData);
    return response.data;
  },
  update: async (id, itemData) => {
    const response = await api.put(`/api/v1/items/${id}`, itemData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/api/v1/items/${id}`);
    return response.data;
  },
};

export const inventoryService = {
  list: async () => {
    const response = await api.get("/api/v1/inventory");
    return response.data;
  },
  listLowStock: async () => {
    const response = await api.get("/api/v1/inventory/low-stock");
    return response.data;
  },
  updateStock: async (itemId, warehouseId, currentStock) => {
    const response = await api.put(`/api/v1/inventory/${itemId}`, {
      warehouse_id: warehouseId,
      current_stock: currentStock,
    });
    return response.data;
  },
  adjustStock: async (
    itemId,
    warehouseId,
    adjustmentType,
    quantity,
    reasonCode,
    notes = "",
  ) => {
    const response = await api.post(`/api/v1/inventory/${itemId}/adjust`, {
      warehouse_id: warehouseId,
      adjustment_type: adjustmentType,
      quantity,
      reason_code: reasonCode,
      notes,
    });
    return response.data;
  },
  transferStock: async (
    itemId,
    sourceWarehouseId,
    destinationWarehouseId,
    quantity,
    notes = "",
  ) => {
    const response = await api.post(`/api/v1/inventory/${itemId}/transfer`, {
      source_warehouse_id: sourceWarehouseId,
      destination_warehouse_id: destinationWarehouseId,
      quantity,
      notes,
    });
    return response.data;
  },
  listAdjustments: async () => {
    const response = await api.get("/api/v1/inventory/adjustments");
    return response.data;
  },
  listWarehouses: async () => {
    const response = await api.get("/api/v1/inventory/warehouses");
    return response.data;
  },
};

export default api;
