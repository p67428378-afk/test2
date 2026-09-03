// @vitest-environment jsdom
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import CategoriesPage from "./CategoriesPage";

vi.mock("../services/api.js", () => ({
  categoryService: {
    getCategories: vi.fn().mockResolvedValue([
      { id: "uuid-1", name: "Car", created_at: "2026-01-01T00:00:00Z" },
      { id: "uuid-2", name: "Bike", created_at: "2026-01-01T00:00:00Z" },
    ]),
    createCategory: vi.fn().mockResolvedValue({
      id: "uuid-3",
      name: "Truck",
      created_at: "2026-01-01T00:00:00Z",
    }),
  },
  parkingService: {
    searchSpots: vi.fn().mockResolvedValue([]),
  },
}));

describe("CategoriesPage", () => {
  it("renders page header and categories", async () => {
    render(
      <BrowserRouter>
        <CategoriesPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Vehicle Category Management")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Registered Categories/i)).toBeInTheDocument();
    });
  });
});
