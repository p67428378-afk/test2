import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("API Services Export Check", () => {
  it("should export all required API functions", () => {
    expect(typeof api.getProducts).toBe("function");
    expect(typeof api.getWarrantyStats).toBe("function");
    expect(typeof api.getProductDetails).toBe("function");
    expect(typeof api.registerProduct).toBe("function");
    expect(typeof api.updateProduct).toBe("function");
    expect(typeof api.deleteProduct).toBe("function");
    expect(typeof api.uploadDocument).toBe("function");
    expect(typeof api.submitClaim).toBe("function");
    expect(typeof api.getClaims).toBe("function");
    expect(typeof api.updateClaimStatus).toBe("function");
    expect(typeof api.getClaimAuditLogs).toBe("function");
    expect(typeof api.triggerExpiryEvaluation).toBe("function");
  });
});
