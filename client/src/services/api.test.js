import { describe, it, expect } from "vitest";
import { authAPI, tasksAPI, costsAPI, categoriesAPI, usersAPI } from "./api";

describe("API Service Contracts", () => {
  it("exports required API endpoint methods", () => {
    expect(typeof authAPI.login).toBe("function");
    expect(typeof authAPI.getMe).toBe("function");
    expect(typeof tasksAPI.listTasks).toBe("function");
    expect(typeof tasksAPI.createTask).toBe("function");
    expect(typeof tasksAPI.getTask).toBe("function");
    expect(typeof tasksAPI.updateTask).toBe("function");
    expect(typeof tasksAPI.deleteTask).toBe("function");
    expect(typeof tasksAPI.assignTask).toBe("function");
    expect(typeof tasksAPI.completeTask).toBe("function");
    expect(typeof tasksAPI.getTaskLogs).toBe("function");
    expect(typeof costsAPI.getSummary).toBe("function");
    expect(typeof categoriesAPI.listCategories).toBe("function");
    expect(typeof usersAPI.listUsers).toBe("function");
  });
});
