import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import UserDashboardPage from "./UserDashboardPage";
import { authService, subscriptionService } from "../services/api";

vi.mock("../services/api", () => ({
  authService: {
    isAuthenticated: vi.fn(),
    getCurrentUserEmail: vi.fn(),
  },
  subscriptionService: {
    getMySubscription: vi.fn(),
    getUpsellEligibility: vi.fn(),
  },
}));

describe("UserDashboardPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    authService.isAuthenticated.mockReturnValue(true);
    subscriptionService.getMySubscription.mockReturnValue(
      new Promise(() => {}),
    );

    render(
      <MemoryRouter>
        <UserDashboardPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/Loading your dashboard\.\.\./i),
    ).toBeInTheDocument();
  });

  it("renders dashboard content when authenticated", async () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.getCurrentUserEmail.mockReturnValue("alex.mercer@email.com");
    subscriptionService.getMySubscription.mockResolvedValue({
      subscription: {
        id: "sub-123",
        box_size: "Large",
        status: "active",
        next_payment_date: "2026-08-14T10:00:00Z",
      },
      billing_history: [],
    });
    subscriptionService.getUpsellEligibility.mockResolvedValue({
      is_eligible: false,
    });

    render(
      <MemoryRouter>
        <UserDashboardPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("ChocoLux")).toBeInTheDocument();
      expect(screen.getByText("Large Box (active)")).toBeInTheDocument();
      expect(screen.getByText("Loyalty Points")).toBeInTheDocument();
    });
  });
});
