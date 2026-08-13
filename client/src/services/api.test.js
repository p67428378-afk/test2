import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("API Integration Layer", () => {
  it("exports expected stage & scheduling API functions", () => {
    expect(typeof api.getStages).toBe("function");
    expect(typeof api.createStage).toBe("function");
    expect(typeof api.getArtists).toBe("function");
    expect(typeof api.createArtist).toBe("function");
    expect(typeof api.getStagePerformances).toBe("function");
    expect(typeof api.createPerformance).toBe("function");
    expect(typeof api.updatePerformanceDelay).toBe("function");
  });

  it("exports expected volunteer coordination API functions", () => {
    expect(typeof api.getVolunteers).toBe("function");
    expect(typeof api.createVolunteer).toBe("function");
    expect(typeof api.getVolunteerShifts).toBe("function");
    expect(typeof api.createVolunteerShift).toBe("function");
    expect(typeof api.checkInVolunteerShift).toBe("function");
    expect(typeof api.dropVolunteerShift).toBe("function");
  });

  it("exports expected ticket validation & crowd analytics API functions", () => {
    expect(typeof api.validateTicket).toBe("function");
    expect(typeof api.syncOfflineTickets).toBe("function");
    expect(typeof api.getCrowdAnalytics).toBe("function");
    expect(typeof api.ingestCrowdTelemetry).toBe("function");
  });
});
