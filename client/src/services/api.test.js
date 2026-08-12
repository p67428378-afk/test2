import { describe, it, expect } from "vitest";
import { authAPI, ordersAPI, pickupsAPI, routesAPI, paymentsAPI } from "./api";

describe("API Services Module", () => {
  it("exports authAPI functions", () => {
    expect(typeof authAPI.login).toBe("function");
    expect(typeof authAPI.register).toBe("function");
    expect(typeof authAPI.getMe).toBe("function");
    expect(typeof authAPI.logout).toBe("function");
  });

  it("exports ordersAPI functions", () => {
    expect(typeof ordersAPI.createOrder).toBe("function");
    expect(typeof ordersAPI.getOrders).toBe("function");
    expect(typeof ordersAPI.getOrderById).toBe("function");
    expect(typeof ordersAPI.updateStage).toBe("function");
  });

  it("exports pickupsAPI functions", () => {
    expect(typeof pickupsAPI.getPickups).toBe("function");
    expect(typeof pickupsAPI.schedulePickup).toBe("function");
  });

  it("exports routesAPI functions", () => {
    expect(typeof routesAPI.getDriverRoutes).toBe("function");
    expect(typeof routesAPI.updateStopStatus).toBe("function");
    expect(typeof routesAPI.createRoute).toBe("function");
  });

  it("exports paymentsAPI functions", () => {
    expect(typeof paymentsAPI.createCheckoutSession).toBe("function");
  });
});
