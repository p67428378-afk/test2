import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import DashboardPage from "./DashboardPage";

// Mock API functions
vi.mock("../services/api", () => ({
  getProducts: vi.fn().mockResolvedValue([]),
  getWarrantyStats: vi
    .fn()
    .mockResolvedValue({
      total_products: 0,
      active: 0,
      expiring_soon: 0,
      expired: 0,
    }),
  deleteProduct: vi.fn(),
  triggerExpiryEvaluation: vi.fn(),
}));

describe("DashboardPage Component", () => {
  it("renders dashboard heading without crashing", async () => {
    render(
      <BrowserRouter>
        <DashboardPage
          isRegisterModalOpen={false}
          onToggleRegisterModal={() => {}}
        />
      </BrowserRouter>,
    );

    expect(
      await screen.findByText("Warranty Overview Dashboard"),
    ).toBeInTheDocument();
  });
});
