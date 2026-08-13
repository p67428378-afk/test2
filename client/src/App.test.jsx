// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api.js", () => {
  return {
    paintingService: {
      getPaintings: vi.fn().mockResolvedValue({
        items: [
          {
            id: "1",
            title: "Abstract Cityscape",
            artist_name: "Elena Rostova",
            image_url: "https://example.com/image.jpg",
            price: "250.00",
            dimensions: "24x36 in",
            stock: 1,
          },
        ],
        page: 1,
        pages: 1,
        total: 1,
      }),
      getPainting: vi.fn().mockResolvedValue({
        id: "1",
        title: "Abstract Cityscape",
        artist_name: "Elena Rostova",
        image_url: "https://example.com/image.jpg",
        price: "250.00",
        dimensions: "24x36 in",
        stock: 1,
      }),
    },
    cartService: {
      getCart: vi.fn().mockResolvedValue({
        items: [],
        subtotal: "0.00",
        total: "0.00",
      }),
      addCartItem: vi.fn().mockResolvedValue({
        item: {
          id: "c1",
          painting_id: "1",
          title: "Abstract Cityscape",
          price: "250.00",
          quantity: 1,
        },
        message: "Added to cart",
      }),
      removeCartItem: vi.fn().mockResolvedValue({ message: "Removed" }),
    },
    orderService: {
      checkout: vi.fn().mockResolvedValue({
        order_id: "o1",
        status: "SUCCESS",
        total_amount: "250.00",
        client_secret: "secret",
      }),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("App Component", () => {
  it("renders the gallery page with paintings", async () => {
    render(<App />);

    // Check that the header title is displayed
    expect(screen.getByText("Canvas & Co.")).toBeInTheDocument();

    // Wait for the painting to load and render
    await waitFor(() => {
      expect(screen.getByText("Abstract Cityscape")).toBeInTheDocument();
    });

    expect(screen.getByText("Elena Rostova")).toBeInTheDocument();
    expect(screen.getByText("$250.00")).toBeInTheDocument();
  });
});
