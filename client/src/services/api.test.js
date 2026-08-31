import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("API Services Module", () => {
  it("exports all expected tour endpoints", () => {
    expect(typeof api.getTours).toBe("function");
    expect(typeof api.getTour).toBe("function");
    expect(typeof api.createTour).toBe("function");
    expect(typeof api.updateTour).toBe("function");
    expect(typeof api.deleteTour).toBe("function");
  });

  it("exports all expected schedule endpoints", () => {
    expect(typeof api.getSchedules).toBe("function");
    expect(typeof api.getSchedule).toBe("function");
    expect(typeof api.createSchedule).toBe("function");
    expect(typeof api.updateSchedule).toBe("function");
    expect(typeof api.assignGuide).toBe("function");
    expect(typeof api.getScheduleAttendanceReport).toBe("function");
  });

  it("exports all expected booking endpoints", () => {
    expect(typeof api.getBookings).toBe("function");
    expect(typeof api.getBooking).toBe("function");
    expect(typeof api.createBooking).toBe("function");
    expect(typeof api.cancelBooking).toBe("function");
  });

  it("exports all expected guide and attendance endpoints", () => {
    expect(typeof api.getGuides).toBe("function");
    expect(typeof api.getGuide).toBe("function");
    expect(typeof api.createGuide).toBe("function");
    expect(typeof api.recordCheckIn).toBe("function");
    expect(typeof api.getAttendanceRecords).toBe("function");
  });
});
