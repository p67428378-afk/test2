import { describe, it, expect, vi, beforeEach } from "vitest";
import api, {
  getKPIs,
  getSKUs,
  getScenario,
  submitAssortmentPlan,
  getAssortmentPlan,
} from "./api.js";

vi.mock("axios", () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    create: vi.fn().mockReturnThis(),
    defaults: { headers: { common: {} } },
  };
  return {
    default: mockAxiosInstance,
  };
});

describe("API Service Methods", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getKPIs calls correct endpoint", async () => {
    api.get.mockResolvedValueOnce({ data: { sales_per_linear_ft: 15.75 } });
    const data = await getKPIs();
    expect(api.get).toHaveBeenCalledWith("/api/v1/kpis");
    expect(data.sales_per_linear_ft).toBe(15.75);
  });

  it("getSKUs calls correct endpoint with params", async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    await getSKUs("-sales_per_linear_ft", "GROW");
    expect(api.get).toHaveBeenCalledWith("/api/v1/skus", {
      params: { sort_by: "-sales_per_linear_ft", filter_status: "GROW" },
    });
  });

  it("getScenario calls correct endpoint", async () => {
    api.get.mockResolvedValueOnce({ data: { scenario_name: "Balanced" } });
    const data = await getScenario("Balanced");
    expect(api.get).toHaveBeenCalledWith("/api/v1/scenarios/Balanced");
    expect(data.scenario_name).toBe("Balanced");
  });

  it("submitAssortmentPlan calls correct endpoint with payload", async () => {
    api.post.mockResolvedValueOnce({ data: { id: "plan-123" } });
    const data = await submitAssortmentPlan("Balanced", "test@example.com");
    expect(api.post).toHaveBeenCalledWith("/api/v1/assortment-plans", {
      scenario_name: "Balanced",
      submitted_by: "test@example.com",
    });
    expect(data.id).toBe("plan-123");
  });

  it("getAssortmentPlan retrieves plan details", async () => {
    api.get.mockResolvedValueOnce({ data: { id: "plan-123" } });
    const data = await getAssortmentPlan("plan-123");
    expect(api.get).toHaveBeenCalledWith("/api/v1/assortment-plans/plan-123");
    expect(data.id).toBe("plan-123");
  });
});
