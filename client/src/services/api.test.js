import { describe, it, expect } from "vitest";
import { parkingService, getWebSocketUrl } from "./api";

describe("API Service Exports", () => {
  it("exports parkingService methods", () => {
    expect(typeof parkingService.searchSpots).toBe("function");
    expect(typeof parkingService.listSpots).toBe("function");
    expect(typeof parkingService.getSpotDetails).toBe("function");
    expect(typeof parkingService.getSpotRates).toBe("function");
    expect(typeof parkingService.calculateCost).toBe("function");
    expect(typeof parkingService.updateSpotStatus).toBe("function");
    expect(typeof parkingService.getRecentEvents).toBe("function");
  });

  it("exports getWebSocketUrl function", () => {
    expect(typeof getWebSocketUrl).toBe("function");
    expect(getWebSocketUrl()).toContain("/api/v1/parking-spots/live-updates");
  });
});
