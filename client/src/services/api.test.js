import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("API Service", () => {
  it("exports all necessary API functions", () => {
    expect(typeof api.getDashboardMetrics).toBe("function");
    expect(typeof api.getSites).toBe("function");
    expect(typeof api.createSite).toBe("function");
    expect(typeof api.getArtifacts).toBe("function");
    expect(typeof api.createArtifact).toBe("function");
    expect(typeof api.getTeams).toBe("function");
    expect(typeof api.createTeam).toBe("function");
    expect(typeof api.uploadMediaRecord).toBe("function");
    expect(typeof api.getLabAnalyses).toBe("function");
    expect(typeof api.createLabAnalysis).toBe("function");
    expect(typeof api.getPublications).toBe("function");
    expect(typeof api.createPublication).toBe("function");
  });
});
