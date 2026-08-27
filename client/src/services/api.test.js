import { describe, it, expect } from "vitest";
import {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  checkHealth,
  apiClient,
} from "./api";

describe("Markdown Editor API Service Exports", () => {
  it("exports document CRUD methods", () => {
    expect(typeof getDocuments).toBe("function");
    expect(typeof getDocument).toBe("function");
    expect(typeof createDocument).toBe("function");
    expect(typeof updateDocument).toBe("function");
    expect(typeof deleteDocument).toBe("function");
    expect(typeof checkHealth).toBe("function");
  });

  it("has configured axios instance", () => {
    expect(apiClient).toBeDefined();
    expect(apiClient.defaults.headers["Content-Type"]).toBe("application/json");
  });
});
