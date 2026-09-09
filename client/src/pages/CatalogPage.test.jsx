import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CatalogPage from "./CatalogPage";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    getProducts: vi.fn(),
  },
}));

describe("CatalogPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders products fetched from api", async () => {
    api.getProducts.mockResolvedValueOnce({
      items: [
        {
          id: "p1",
          name: "Wireless Earbuds",
          category: "Audio",
          description: "Compact wireless earbuds.",
          price: 59.99,
          rating: 4.5,
          tags: ["audio"],
          in_stock: true,
        },
      ],
      total: 1,
      skip: 0,
      limit: 12,
    });

    render(
      <BrowserRouter>
        <CatalogPage onAddToCart={vi.fn()} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Explore All Products")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Wireless Earbuds")).toBeInTheDocument();
    });
  });
});
