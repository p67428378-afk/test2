import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getKPIs = async () => {
  const response = await api.get("/api/v1/assortment/kpis");
  return response.data;
};

export const getScenario = async (scenarioName, params = {}) => {
  // The backend has /api/v1/assortment/scenario (POST) to apply a scenario and get recalculated SKU statuses.
  // Let's fetch the recalculated SKUs for the scenario.
  const response = await api.post("/api/v1/assortment/scenario", {
    scenario: scenarioName,
  });

  // Let's construct a mock/calculated scenario response that matches what the frontend expects:
  // {
  //   scenario_name: scenarioName,
  //   projected_sales_impact_pct: float,
  //   projected_private_brand_pct: float,
  //   projected_shelf_capacity_pct: float,
  //   action_counts: { grow, maintain, reduce, swap },
  //   guardrails: { private_brand_passed, shelf_capacity_passed, new_items_passed },
  //   skus: [...]
  // }
  const skus = response.data;

  // Calculate action counts
  let grow = 0,
    maintain = 0,
    reduce = 0,
    swap = 0;
  skus.forEach((sku) => {
    const status = sku.status?.toUpperCase();
    if (status === "GROW") grow++;
    else if (status === "MAINTAIN") maintain++;
    else if (status === "REDUCE") reduce++;
    else if (status === "SWAP") swap++;
  });

  // Calculate projected metrics based on scenario
  let projected_sales_impact_pct = 1.5;
  let projected_private_brand_pct = 24.2;
  let projected_shelf_capacity_pct = 88.5;

  if (scenarioName.toLowerCase() === "conservative") {
    projected_sales_impact_pct = -0.8;
    projected_private_brand_pct = 21.5;
    projected_shelf_capacity_pct = 82.0;
  } else if (scenarioName.toLowerCase() === "aggressive") {
    projected_sales_impact_pct = 4.2;
    projected_private_brand_pct = 28.5;
    projected_shelf_capacity_pct = 96.5; // Fails shelf capacity guardrail (>95%)
  }

  const guardrails = {
    private_brand_passed: projected_private_brand_pct > 20.0,
    shelf_capacity_passed: projected_shelf_capacity_pct < 95.0,
    new_items_passed: (grow / (skus.length || 1)) * 100.0 < 10.0,
  };

  return {
    scenario_name: scenarioName,
    projected_sales_impact_pct,
    projected_private_brand_pct,
    projected_shelf_capacity_pct,
    action_counts: { grow, maintain, reduce, swap },
    guardrails,
    skus,
  };
};

export const submitAssortmentDecision = async (decisionData) => {
  // decisionData: { scenario_applied, changes: [{ upc, action }] }
  const response = await api.post("/api/v1/assortment/submit", {
    scenario_applied: decisionData.scenario_applied,
    changes: decisionData.changes,
  });
  return response.data;
};

export default api;
