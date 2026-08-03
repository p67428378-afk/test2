import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";
import { categoryService, productService } from "./services/api";

// Mock the API services
vi.mock("./services/api", () => ({
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([
      { id: "cat-1", name: "CPUs", description: "Processors" },
      { id: "cat-2", name: "Graphics Cards", description: "GPUs" },
    ]),
  },
  productService: {
    getProducts: vi.fn().mockResolvedValue([
      {
        id: "prod-1",
        name: "Intel Core i9-14900K",
        brand: "Intel",
        price: 589.99,
        stock_quantity: 10,
        image_url: "",
        description: "High-end desktop processor",
      },
    ]),
  },
}));

describe("App Component", () => {
  it("renders the top navigation bar and homepage", async () => {
    render(<App />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText("PartForge")).toBeInTheDocument();
    });

    // Check if hero banner text is present
    expect(screen.getByText(/Forge Your Ultimate/i)).toBeInTheDocument();
  });
});
