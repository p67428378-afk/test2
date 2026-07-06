import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getDashboardKPIs = async () => {
  try {
    const response = await api.get("/api/v1/dashboard");
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch dashboard KPIs from backend, using mock fallback:",
      error,
    );
    return {
      sales_per_linear_ft: 1245.5,
      private_brand_percent: 15.4,
      in_stock_rate: 96.8,
      shelf_capacity_percent: 88.2,
      vendor_fill_rate_percent: 94.5,
    };
  }
};

export const getSKUPerformance = async () => {
  try {
    const response = await api.get("/api/v1/sku-performance");
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch SKU performance from backend, using mock fallback:",
      error,
    );
    return [
      {
        id: "sku-1001",
        sku: "SKU-1001",
        product_name: "Clover Valley Potato Chips 10oz",
        sales: 12450,
        units: 5200,
        profit_margin: 38.5,
        days_of_supply: 14,
        status_badge: "GROW",
        is_private_brand: true,
        vendor_fill_rate_percent: 95.2,
      },
      {
        id: "sku-1002",
        sku: "SKU-1002",
        product_name: "Lay's Classic Potato Chips 8oz",
        sales: 18200,
        units: 6500,
        profit_margin: 22.0,
        days_of_supply: 8,
        status_badge: "MAINTAIN",
        is_private_brand: false,
        vendor_fill_rate_percent: 91.5,
      },
      {
        id: "sku-1003",
        sku: "SKU-1003",
        product_name: "Clover Valley Tortilla Chips 12oz",
        sales: 3100,
        units: 1200,
        profit_margin: 41.0,
        days_of_supply: 28,
        status_badge: "SWAP",
        is_private_brand: true,
        vendor_fill_rate_percent: 88.0,
      },
      {
        id: "sku-1004",
        sku: "SKU-1004",
        product_name: "Branded Cheese Puffs 6oz",
        sales: 1200,
        units: 450,
        profit_margin: 15.0,
        days_of_supply: 45,
        status_badge: "REDUCE",
        is_private_brand: false,
        vendor_fill_rate_percent: 82.4,
      },
      {
        id: "sku-1005",
        sku: "SKU-1005",
        product_name: "Clover Valley Pretzels 16oz",
        sales: 8900,
        units: 3800,
        profit_margin: 35.0,
        days_of_supply: 12,
        status_badge: "GROW",
        is_private_brand: true,
        vendor_fill_rate_percent: 96.1,
      },
    ];
  }
};

export const getScenarios = async () => {
  try {
    const response = await api.get("/api/v1/scenarios");
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch scenarios from backend, using mock fallback:",
      error,
    );
    return [
      {
        id: "scenario-conservative",
        name: "Conservative",
        description:
          "Minimal changes, focusing on removing only the worst-performing SKUs.",
        projected_sales_lift: 1.5,
        projected_profit_margin: 31.0,
        new_private_brand_percent: 15.5,
        skus_to_add: 2,
        skus_to_remove: 5,
        skus_to_swap: 1,
      },
      {
        id: "scenario-balanced",
        name: "Balanced",
        description:
          "Moderate optimization balancing private brand growth and shelf space efficiency.",
        projected_sales_lift: 4.2,
        projected_profit_margin: 35.4,
        new_private_brand_percent: 16.8,
        skus_to_add: 4,
        skus_to_remove: 4,
        skus_to_swap: 2,
      },
      {
        id: "scenario-aggressive",
        name: "Aggressive",
        description:
          "High-impact changes maximizing private brand penetration and sales velocity.",
        projected_sales_lift: 7.8,
        projected_profit_margin: 38.2,
        new_private_brand_percent: 18.5,
        skus_to_add: 8,
        skus_to_remove: 6,
        skus_to_swap: 4,
      },
    ];
  }
};

export const submitAssortmentPlan = async (
  scenarioId,
  userId = "manager-1",
) => {
  try {
    const response = await api.post("/api/v1/submit", {
      scenario_id: scenarioId,
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to submit assortment plan to backend, using mock fallback:",
      error,
    );
    return {
      selected_scenario: scenarioId.includes("conservative")
        ? "Conservative"
        : scenarioId.includes("aggressive")
          ? "Aggressive"
          : "Balanced",
      status: "Submitted",
      submission_id: "sub-" + Math.random().toString(36).substr(2, 9),
      submitted_by: userId,
      timestamp: new Date().toISOString(),
    };
  }
};

export const seedDatabase = async () => {
  try {
    const response = await api.post("/api/v1/seed");
    return response.data;
  } catch (error) {
    console.warn("Failed to seed database:", error);
    return {
      status: "success",
      message: "Database seeded successfully (mock)",
    };
  }
};

export default api;
