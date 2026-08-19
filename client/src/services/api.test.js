import { describe, it, expect } from "vitest";
import {
  authApi,
  conferenceApi,
  sessionApi,
  reviewApi,
  registrationApi,
  scheduleApi,
  attendanceApi,
} from "./api";

describe("API Services Export Contract", () => {
  it("defines authApi methods", () => {
    expect(typeof authApi.login).toBe("function");
    expect(typeof authApi.register).toBe("function");
    expect(typeof authApi.getMe).toBe("function");
  });

  it("defines conferenceApi methods", () => {
    expect(typeof conferenceApi.createConference).toBe("function");
    expect(typeof conferenceApi.listConferences).toBe("function");
    expect(typeof conferenceApi.getConference).toBe("function");
  });

  it("defines sessionApi methods", () => {
    expect(typeof sessionApi.createSession).toBe("function");
    expect(typeof sessionApi.listSessions).toBe("function");
    expect(typeof sessionApi.getSession).toBe("function");
  });

  it("defines reviewApi methods", () => {
    expect(typeof reviewApi.submitReview).toBe("function");
    expect(typeof reviewApi.getSessionReviews).toBe("function");
  });

  it("defines registrationApi methods", () => {
    expect(typeof registrationApi.registerConference).toBe("function");
    expect(typeof registrationApi.getUserRegistrations).toBe("function");
    expect(typeof registrationApi.listRegistrations).toBe("function");
  });

  it("defines scheduleApi methods", () => {
    expect(typeof scheduleApi.publishSchedule).toBe("function");
    expect(typeof scheduleApi.getConferenceSchedule).toBe("function");
  });

  it("defines attendanceApi methods", () => {
    expect(typeof attendanceApi.checkInAttendee).toBe("function");
    expect(typeof attendanceApi.getSessionAttendance).toBe("function");
  });
});
