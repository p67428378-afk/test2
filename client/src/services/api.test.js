import { describe, it, expect } from "vitest";
import { authApi, donationApi, claimApi, deliveryApi, adminApi } from "./api";

describe("API Services Export Suite", () => {
  it("exports authApi methods", () => {
    expect(authApi.login).toBeTypeOf("function");
    expect(authApi.register).toBeTypeOf("function");
    expect(authApi.logout).toBeTypeOf("function");
    expect(authApi.getCurrentUser).toBeTypeOf("function");
  });

  it("exports donationApi methods", () => {
    expect(donationApi.getDonations).toBeTypeOf("function");
    expect(donationApi.createDonation).toBeTypeOf("function");
    expect(donationApi.updateFreshness).toBeTypeOf("function");
  });

  it("exports claimApi methods", () => {
    expect(claimApi.getClaims).toBeTypeOf("function");
    expect(claimApi.createClaim).toBeTypeOf("function");
  });

  it("exports deliveryApi methods", () => {
    expect(deliveryApi.getDeliveries).toBeTypeOf("function");
    expect(deliveryApi.updateDeliveryStatus).toBeTypeOf("function");
  });

  it("exports adminApi methods", () => {
    expect(adminApi.getAnalytics).toBeTypeOf("function");
    expect(adminApi.getAuditLogs).toBeTypeOf("function");
  });
});
