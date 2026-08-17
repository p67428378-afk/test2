import { describe, it, expect } from "vitest";
import { authService, itemService, claimService } from "./api";

describe("API Services Structure", () => {
  it("exports authService methods", () => {
    expect(typeof authService.login).toBe("function");
    expect(typeof authService.register).toBe("function");
    expect(typeof authService.logout).toBe("function");
  });

  it("exports itemService methods", () => {
    expect(typeof itemService.getItems).toBe("function");
    expect(typeof itemService.getItemById).toBe("function");
    expect(typeof itemService.reportItem).toBe("function");
    expect(typeof itemService.getItemMatches).toBe("function");
  });

  it("exports claimService methods", () => {
    expect(typeof claimService.submitClaim).toBe("function");
    expect(typeof claimService.getAdminClaims).toBe("function");
    expect(typeof claimService.verifyClaim).toBe("function");
    expect(typeof claimService.getItemHistory).toBe("function");
  });
});
