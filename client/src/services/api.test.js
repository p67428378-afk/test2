import { describe, it, expect } from "vitest";
import { authService, taskService, reportService } from "./api";

describe("API Services Structure", () => {
  it("should export authService with correct methods", () => {
    expect(authService).toBeDefined();
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.logout).toBe("function");
    expect(typeof authService.getCurrentUser).toBe("function");
    expect(typeof authService.isAuthenticated).toBe("function");
  });

  it("should export taskService with correct methods", () => {
    expect(taskService).toBeDefined();
    expect(typeof taskService.getTasks).toBe("function");
    expect(typeof taskService.getTask).toBe("function");
    expect(typeof taskService.createTask).toBe("function");
    expect(typeof taskService.updateTask).toBe("function");
    expect(typeof taskService.deleteTask).toBe("function");
    expect(typeof taskService.triggerReminders).toBe("function");
  });

  it("should export reportService with correct methods", () => {
    expect(reportService).toBeDefined();
    expect(typeof reportService.getDashboardMetrics).toBe("function");
  });
});
