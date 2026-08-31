import { describe, it, expect } from "vitest";
import * as api from "./api";

describe("API Service Exports", () => {
  it("exports all expected API service functions", () => {
    expect(typeof api.getChocolates).toBe("function");
    expect(typeof api.getChocolateById).toBe("function");
    expect(typeof api.createChocolate).toBe("function");
    expect(typeof api.getCart).toBe("function");
    expect(typeof api.addToCart).toBe("function");
    expect(typeof api.updateCartItem).toBe("function");
    expect(typeof api.removeCartItem).toBe("function");
    expect(typeof api.placeOrder).toBe("function");
    expect(typeof api.getOrder).toBe("function");
    expect(typeof api.getHealth).toBe("function");
  });
});
