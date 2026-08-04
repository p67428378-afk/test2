import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchKPIs = async (clusterId = "small-town-value") => {
  try {
    const response = await api.get("/api/v1/assortment/kpis", {
      params: { cluster_id: clusterId },
    });
    return response.data;
  } catch (error) {
    console.warn("API fetchKPIs error, using fallback data", error);
    return {
      cluster_id: clusterId,
      sales_per_linear_ft: 245.5,
      private_brand_share_pct: 28.5,
      instock_rate_pct: 96.2,
      shelf_capacity_utilization_pct: 92.0,
      last_updated: new Date().toISOString(),
    };
  }
};

export const fetchSKUs = async (
  clusterId = "small-town-value",
  category = "Snacks",
) => {
  try {
    const response = await api.get("/api/v1/assortment/skus", {
      params: { cluster_id: clusterId, category },
    });
    return response.data;
  } catch (error) {
    console.warn("API fetchSKUs error, using fallback data", error);
    return {
      total_count: 4,
      skus: [
        {
          sku_id: "SKU-9901",
          name: "Lays Classic 10oz",
          category: "Snacks",
          sub_category: "Chips",
          velocity_units_per_wk: 45,
          margin_pct: 18.0,
          linear_ft_space: 1.2,
          is_private_brand: false,
          status_badge: "MAINTAIN",
        },
        {
          sku_id: "SKU-4422",
          name: "Clover Valley Pretzels",
          category: "Snacks",
          sub_category: "Pretzels",
          velocity_units_per_wk: 32,
          margin_pct: 34.0,
          linear_ft_space: 0.8,
          is_private_brand: true,
          status_badge: "GROW",
        },
        {
          sku_id: "SKU-1150",
          name: "Cheetos Flamin Hot",
          category: "Snacks",
          sub_category: "Extruded",
          velocity_units_per_wk: 60,
          margin_pct: 22.0,
          linear_ft_space: 1.5,
          is_private_brand: false,
          status_badge: "SWAP",
        },
        {
          sku_id: "SKU-8831",
          name: "Generic Popcorn",
          category: "Snacks",
          sub_category: "Popcorn",
          velocity_units_per_wk: 12,
          margin_pct: 15.0,
          linear_ft_space: 0.5,
          is_private_brand: false,
          status_badge: "REDUCE",
        },
      ],
    };
  }
};

export const fetchScenarios = async () => {
  try {
    const response = await api.get("/api/v1/assortment/scenarios");
    return response.data;
  } catch (error) {
    console.warn("API fetchScenarios error, using fallback data", error);
    return {
      default_selected: "balanced",
      scenarios: [
        {
          id: "conservative",
          label: "Conservative",
          projected_sales_delta_pct: 1.2,
          projected_pb_share_pct: 26.0,
          shelf_capacity_impact_pct: -0.5,
        },
        {
          id: "balanced",
          label: "Balanced",
          projected_sales_delta_pct: 4.5,
          projected_pb_share_pct: 28.5,
          shelf_capacity_impact_pct: 1.2,
        },
        {
          id: "aggressive",
          label: "Aggressive",
          projected_sales_delta_pct: 8.1,
          projected_pb_share_pct: 32.0,
          shelf_capacity_impact_pct: 4.5,
        },
      ],
    };
  }
};

export const submitRecommendation = async (payload) => {
  const response = await api.post("/api/v1/assortment/submit", payload);
  return response.data;
};

export const authService = {
  getCurrentUser: async () => {
    return {
      id: "00000000-0000-0000-0000-000000000000",
      email: "test@example.com",
      full_name: "Aarchi Jain",
      role: "category_manager",
    };
  },
  login: async () => {
    return {
      access_token: "mock-token",
      token_type: "bearer",
    };
  },
  logout: () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("token");
    }
  },
  initiatePasswordReset: async () => ({
    otp_session_id: "session-123",
    security_question: "What is your favorite color?",
  }),
  verifyOtp: async () => ({
    security_question_session_id: "sec-123",
  }),
  verifySecurityQuestion: async () => ({
    password_reset_session_id: "pw-123",
  }),
  setNewPassword: async () => true,
};

export const inventoryService = {
  getInventoryItems: async () => [
    {
      item_id: "1",
      name: "Sterile Gloves",
      category: "PPE",
      quantity: 50,
      unit: "box",
      supplier: "Medline",
      is_low_stock: false,
      low_stock_threshold: 10,
    },
    {
      item_id: "2",
      name: "Surgical Mask",
      category: "PPE",
      quantity: 5,
      unit: "box",
      supplier: "3M",
      is_low_stock: true,
      low_stock_threshold: 10,
    },
  ],
  deleteInventoryItem: async () => true,
  getInventoryItemById: async (id) => ({
    item_id: id,
    name: "Sterile Gloves",
    category: "PPE",
    quantity: 50,
    unit: "box",
    supplier: "Medline",
    low_stock_threshold: 10,
  }),
  createInventoryItem: async (data) => ({ item_id: "3", ...data }),
  updateInventoryItem: async (id, data) => ({ item_id: id, ...data }),
};

export default api;
