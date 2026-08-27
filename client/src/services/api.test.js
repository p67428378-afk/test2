import { describe, it, expect } from "vitest";
import api, {
  fetchDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
} from "./api";

describe("API Service Exports", () => {
  it("exports all expected CRUD methods as functions", () => {
    expect(typeof fetchDocuments).toBe("function");
    expect(typeof getDocument).toBe("function");
    expect(typeof createDocument).toBe("function");
    expect(typeof updateDocument).toBe("function");
    expect(typeof deleteDocument).toBe("function");
  });

  it("default export includes all endpoints and apiClient", () => {
    expect(api.fetchDocuments).toBe(fetchDocuments);
    expect(api.getDocument).toBe(getDocument);
    expect(api.createDocument).toBe(createDocument);
    expect(api.updateDocument).toBe(updateDocument);
    expect(api.deleteDocument).toBe(deleteDocument);
    expect(api.apiClient).toBeDefined();
  });
});
