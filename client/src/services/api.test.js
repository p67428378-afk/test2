import { describe, it, expect, vi } from "vitest";
import api, { authService, resumeService } from "./api";

describe("API Service Exports", () => {
  it("exports a default axios instance", () => {
    expect(api).toBeDefined();
    expect(typeof api.get).toBe("function");
  });

  it("exports authService with all methods", () => {
    expect(authService).toBeDefined();
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.getMe).toBe("function");
    expect(typeof authService.logout).toBe("function");
  });

  it("exports resumeService with all methods", () => {
    expect(resumeService).toBeDefined();
    expect(typeof resumeService.getTemplates).toBe("function");
    expect(typeof resumeService.listResumes).toBe("function");
    expect(typeof resumeService.getResume).toBe("function");
    expect(typeof resumeService.createResume).toBe("function");
    expect(typeof resumeService.updateResume).toBe("function");
    expect(typeof resumeService.deleteResume).toBe("function");
    expect(typeof resumeService.exportPdf).toBe("function");
    expect(typeof resumeService.healthCheck).toBe("function");
  });

  it("axios request interceptor is configured", () => {
    // This is a structural test to ensure the interceptor is attached.
    // It doesn't test the interceptor's logic directly.
    expect(api.interceptors.request.handlers).toHaveLength(1);
  });
});
