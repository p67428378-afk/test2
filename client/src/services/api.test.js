import { describe, it, expect } from "vitest";
import { api, apiClient } from "./api";

describe("api service structure", () => {
  it("exports apiClient with default baseURL configuration", () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it("exports expected product endpoints", () => {
    expect(typeof api.getProducts).toBe("function");
    expect(typeof api.getProductById).toBe("function");
    expect(typeof api.createProduct).toBe("function");
  });

  it("exports expected user preference endpoints", () => {
    expect(typeof api.savePreferences).toBe("function");
    expect(typeof api.getPreferences).toBe("function");
  });

  it("exports expected recommendation endpoints", () => {
    expect(typeof api.generateRecommendations).toBe("function");
    expect(typeof api.submitFeedback).toBe("function");
  });

  it("exports health check endpoint", () => {
    expect(typeof api.checkHealth).toBe("function");
  });
});
