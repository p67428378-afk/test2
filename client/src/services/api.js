import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock Fallback Data
const MOCK_KPIS = {
  sales_per_linear_ft: 15.75,
  private_brand_percentage: 22.5,
  in_stock_rate: 98.2,
  shelf_capacity: 85.0,
};

const MOCK_SKUS = [
  {
    id: 1,
    name: "DG Home Paper Towels 2-Ply",
    sales: 12450,
    profit_margin: 24.5,
    units_sold: 5000,
    status: "GROW",
  },
  {
    id: 2,
    name: "Clover Valley Potato Chips Salted",
    sales: 8900,
    profit_margin: 28.0,
    units_sold: 4500,
    status: "GROW",
  },
  {
    id: 3,
    name: "Brand Name Soda 12-Pack",
    sales: 15600,
    profit_margin: 12.5,
    units_sold: 6200,
    status: "MAINTAIN",
  },
  {
    id: 4,
    name: "Clover Valley Chocolate Chip Cookies",
    sales: 4200,
    profit_margin: 21.0,
    units_sold: 2100,
    status: "SWAP",
  },
  {
    id: 5,
    name: "Budget Choice Paper Plates",
    sales: 1800,
    profit_margin: 8.5,
    units_sold: 900,
    status: "REDUCE",
  },
];

const MOCK_SCENARIOS = {
  Conservative: {
    projected_sales_lift: 1.2,
    projected_margin_lift: 0.8,
    guardrails: [
      {
        name: "Private Brand % remains above 20%",
        status: "PASSED",
        message: "Private Brand % remains above 20%",
      },
      {
        name: "Shelf Capacity remains below 90%",
        status: "PASSED",
        message: "Shelf Capacity remains below 90%",
      },
    ],
    sku_actions: [{ action: "MAINTAIN" }, { action: "MAINTAIN" }],
  },
  Balanced: {
    projected_sales_lift: 4.5,
    projected_margin_lift: 3.2,
    guardrails: [
      {
        name: "Private Brand % remains above 20%",
        status: "PASSED",
        message: "Private Brand % remains above 20%",
      },
      {
        name: "Shelf Capacity remains below 90%",
        status: "PASSED",
        message: "Shelf Capacity remains below 90%",
      },
    ],
    sku_actions: [{ action: "GROW" }, { action: "GROW" }, { action: "SWAP" }],
  },
  Aggressive: {
    projected_sales_lift: 8.1,
    projected_margin_lift: 6.5,
    guardrails: [
      {
        name: "Private Brand % remains above 20%",
        status: "PASSED",
        message: "Private Brand % remains above 20%",
      },
      {
        name: "Shelf Capacity remains below 90%",
        status: "FAILED",
        message: "Shelf Capacity exceeds 90% limit",
      },
    ],
    sku_actions: [
      { action: "GROW" },
      { action: "GROW" },
      { action: "SWAP" },
      { action: "REDUCE" },
    ],
  },
};

export const getKPIs = async () => {
  try {
    const response = await api.get("/api/v1/kpis");
    return response.data;
  } catch (error) {
    console.warn("API Error, falling back to mock KPIs:", error.message);
    return MOCK_KPIS;
  }
};

export const getSKUs = async (status = "") => {
  try {
    const params = status ? { status } : {};
    const response = await api.get("/api/v1/skus", { params });
    return response.data;
  } catch (error) {
    console.warn("API Error, falling back to mock SKUs:", error.message);
    if (status) {
      return MOCK_SKUS.filter(
        (sku) => sku.status.toUpperCase() === status.toUpperCase(),
      );
    }
    return MOCK_SKUS;
  }
};

export const calculateScenario = async (scenarioName) => {
  try {
    const response = await api.post("/api/v1/scenarios/calculate", {
      scenario_name: scenarioName,
    });
    return response.data;
  } catch (error) {
    console.warn(
      "API Error, falling back to mock scenario calculation:",
      error.message,
    );
    return MOCK_SCENARIOS[scenarioName] || MOCK_SCENARIOS["Balanced"];
  }
};

export const submitAssortmentReview = async (scenarioName) => {
  try {
    const response = await api.post("/api/v1/assortment-reviews", {
      scenario_name: scenarioName,
    });
    return response.data;
  } catch (error) {
    console.warn("API Error, falling back to mock submission:", error.message);
    return {
      id: "rev_" + Math.random().toString(36).substr(2, 9),
      scenario_name: scenarioName,
      created_at: new Date().toISOString(),
      submitted_by: "Category Manager",
      audit_trail_summary: {
        submission_id: "SUB-" + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toLocaleString(),
      },
    };
  }
};

export default api;
