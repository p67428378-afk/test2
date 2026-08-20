import { describe, it, expect } from "vitest";
import api from "./api";

describe("API Service Layer Structural Tests", () => {
  it("exports api object with required endpoint functions", () => {
    expect(api).toBeDefined();
    expect(typeof api.getApiaries).toBe("function");
    expect(typeof api.createApiary).toBe("function");
    expect(typeof api.getHives).toBe("function");
    expect(typeof api.createHive).toBe("function");
    expect(typeof api.updateHive).toBe("function");
    expect(typeof api.ingestTelemetry).toBe("function");
    expect(typeof api.getHarvests).toBe("function");
    expect(typeof api.createHarvest).toBe("function");
    expect(typeof api.getDiseaseReports).toBe("function");
    expect(typeof api.createDiseaseReport).toBe("function");
    expect(typeof api.getInspections).toBe("function");
    expect(typeof api.createInspection).toBe("function");
    expect(typeof api.updateInspection).toBe("function");
    expect(typeof api.getSeasonalAnalytics).toBe("function");
  });
});
