import { describe, it, expect } from "vitest";
import {
  authAPI,
  toursAPI,
  schedulesAPI,
  bookingsAPI,
  attendanceAPI,
} from "./api";

describe("API Services", () => {
  it("exports authAPI endpoints", () => {
    expect(typeof authAPI.login).toBe("function");
    expect(typeof authAPI.register).toBe("function");
    expect(typeof authAPI.getGuides).toBe("function");
  });

  it("exports toursAPI endpoints", () => {
    expect(typeof toursAPI.listTours).toBe("function");
    expect(typeof toursAPI.createTour).toBe("function");
  });

  it("exports schedulesAPI endpoints", () => {
    expect(typeof schedulesAPI.listSchedules).toBe("function");
    expect(typeof schedulesAPI.createSchedule).toBe("function");
  });

  it("exports bookingsAPI endpoints", () => {
    expect(typeof bookingsAPI.createBooking).toBe("function");
    expect(typeof bookingsAPI.getMyBookings).toBe("function");
  });

  it("exports attendanceAPI endpoints", () => {
    expect(typeof attendanceAPI.getAttendanceSheet).toBe("function");
    expect(typeof attendanceAPI.checkInVisitor).toBe("function");
  });
});
