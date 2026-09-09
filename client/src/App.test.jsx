import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./services/api", () => ({
  api: {
    getProducts: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getPreferences: vi.fn().mockResolvedValue(null),
    generateRecommendations: vi.fn().mockResolvedValue({ recommendations: [] }),
  },
}));

describe("App Component", () => {
  it("renders application navigation and layout shell", async () => {
    render(<App />);
    expect(screen.getAllByText("RecomCommerce").length).toBeGreaterThan(0);
    expect(screen.getByText("Product Catalog")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Explore All Products/i)).toBeInTheDocument();
    });
  });
});
