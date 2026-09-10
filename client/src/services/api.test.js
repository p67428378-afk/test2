import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("api service export contracts", () => {
  it("exports all expected API functions", () => {
    expect(typeof api.classifyEmailText).toBe("function");
    expect(typeof api.classifyEmailFile).toBe("function");
    expect(typeof api.getEmails).toBe("function");
    expect(typeof api.getEmailDetail).toBe("function");
    expect(typeof api.overrideCategory).toBe("function");
    expect(typeof api.deleteEmail).toBe("function");
  });

  it("has default apiClient configured", () => {
    expect(api.default).toBeDefined();
    expect(api.default.defaults.baseURL).toBeDefined();
  });
});
