import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

// Mock the API services
vi.mock("./services/api", () => {
  return {
    authService: {
      getCurrentUser: vi.fn().mockReturnValue(null),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    },
    productService: {
      getCategories: vi.fn().mockResolvedValue([]),
      getProducts: vi.fn().mockResolvedValue({ items: [], total: 0 }),
      getProductById: vi.fn(),
    },
    wishlistService: {
      getWishlist: vi.fn().mockResolvedValue([]),
      addToWishlist: vi.fn(),
      removeFromWishlist: vi.fn(),
    },
    cartService: {
      getCart: vi.fn().mockResolvedValue({ items: [], total_price: 0 }),
      updateCart: vi.fn(),
    },
    adminService: {
      getMetrics: vi.fn(),
      getOrders: vi.fn(),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe("App Smoke Test", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("Aura Threads")).toBeInTheDocument();
  });
});
