import { describe, it, expect } from "vitest";
import api, * as apiService from "./api";

describe("API Service", () => {
  it("should have the correct functions exported", () => {
    expect(typeof apiService.registerUser).toBe("function");
    expect(typeof apiService.loginUser).toBe("function");
    expect(typeof apiService.logoutUser).toBe("function");
    expect(typeof apiService.getItems).toBe("function");
    expect(typeof apiService.getItem).toBe("function");
    expect(typeof apiService.createItem).toBe("function");
    expect(typeof apiService.getItemMatches).toBe("function");
    expect(typeof apiService.createClaim).toBe("function");
    expect(typeof apiService.getClaims).toBe("function");
    expect(typeof apiService.getClaim).toBe("function");
    expect(typeof apiService.verifyClaim).toBe("function");
    expect(typeof apiService.getClaimMessages).toBe("function");
    expect(typeof apiService.createClaimMessage).toBe("function");
  });

  it("axios instance should be created with a base URL", () => {
    const expectedBase = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/v1`;
    expect(api.defaults.baseURL).toBe(expectedBase);
  });
});
