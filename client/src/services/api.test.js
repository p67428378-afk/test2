import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("API Service Functions", () => {
  it("exports all expected authentication and taskflow API functions", () => {
    expect(typeof api.registerUser).toBe("function");
    expect(typeof api.loginUser).toBe("function");
    expect(typeof api.getCurrentUser).toBe("function");
    expect(typeof api.getProjects).toBe("function");
    expect(typeof api.createProject).toBe("function");
    expect(typeof api.getTasks).toBe("function");
    expect(typeof api.createTask).toBe("function");
    expect(typeof api.bulkUpdateTasks).toBe("function");
    expect(typeof api.getTaskAnalytics).toBe("function");
    expect(typeof api.getProductivityAnalytics).toBe("function");
    expect(typeof api.getEscalations).toBe("function");
  });
});
