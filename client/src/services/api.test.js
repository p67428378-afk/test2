import { describe, it, expect } from "vitest";
import {
  loginUser,
  getPerformances,
  getShifts,
  validateTicket,
  getCrowdDensity,
  getTelemetryStreamUrl,
} from "./api";

describe("API Services Contract", () => {
  it("exports valid function definitions for backend integration", () => {
    expect(typeof loginUser).toBe("function");
    expect(typeof getPerformances).toBe("function");
    expect(typeof getShifts).toBe("function");
    expect(typeof validateTicket).toBe("function");
    expect(typeof getCrowdDensity).toBe("function");
    expect(typeof getTelemetryStreamUrl).toBe("function");
  });

  it("constructs correct SSE telemetry stream URL", () => {
    const streamUrl = getTelemetryStreamUrl();
    expect(streamUrl).toContain("/api/v1/telemetry/stream");
  });
});
