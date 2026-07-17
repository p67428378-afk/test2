import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App.jsx";
import { wishlistService, authService } from "./services/api.js";

// Mock the API services
vi.mock("./services/api.js", () => {
  const mockWishlist = [
    {
      id: "item-1",
      product: {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        name: "AeroSound Max Wireless Headphones",
        description: "Experience industry-leading noise cancellation...",
        price: 299.0,
        image_url: "https://example.com/image.jpg",
      },
    },
  ];

  return {
    authService: {
      isAuthenticated: vi.fn(() => false),
      getUsername: vi.fn(() => ""),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    },
    wishlistService: {
      getWishlist: vi.fn(() => Promise.resolve(mockWishlist)),
      addToWishlist: vi.fn(() => Promise.resolve({ id: "item-2" })),
      removeFromWishlist: vi.fn(() => Promise.resolve()),
    },
    default: {
      create: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    },
  };
});

describe("ShopSphere Wishlist App Smoke Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Product Details Page (PDP) by default", () => {
    render(<App />);
    expect(screen.getByText("ShopSphere")).toBeInTheDocument();
    expect(
      screen.getByText("AeroSound Max Wireless Headphones"),
    ).toBeInTheDocument();
    expect(screen.getByText("$299.00")).toBeInTheDocument();
  });

  it("prompts login when clicking wishlist button while unauthenticated", async () => {
    render(<App />);
    const wishlistBtn = screen.getByLabelText("Save to Wishlist");
    fireEvent.click(wishlistBtn);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
