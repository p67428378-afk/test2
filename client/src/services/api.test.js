import { describe, it, expect } from "vitest";
import {
  authService,
  habitService,
  streakService,
  lessonService,
} from "./api.js";

describe("API Services Layer", () => {
  it("exports authService methods", () => {
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.getCurrentUser).toBe("function");
    expect(typeof authService.verifyParentalConsent).toBe("function");
  });

  it("exports habitService methods", () => {
    expect(typeof habitService.getHabits).toBe("function");
    expect(typeof habitService.createHabit).toBe("function");
    expect(typeof habitService.logHabit).toBe("function");
  });

  it("exports streakService methods", () => {
    expect(typeof streakService.getUserStreaks).toBe("function");
  });

  it("exports lessonService methods", () => {
    expect(typeof lessonService.getLessons).toBe("function");
    expect(typeof lessonService.submitQuiz).toBe("function");
  });
});
