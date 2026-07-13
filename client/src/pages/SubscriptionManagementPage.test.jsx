import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import SubscriptionManagementPage from "./SubscriptionManagementPage";

// Mock the services
vi.mock("../services/api", () => ({
  authService: {
    isAuthenticated: () => true,
    getCurrentUserEmail: () => "test@example.com",
    logout: vi.fn(),
  },
  subscriptionService: {
    getMySubscription: () =>
      Promise.resolve({
        subscription: {
          id: "sub-123",
          box_size: "Medium",
          frequency_weeks: 4,
          status: "active",
          next_payment_date: "2026-08-15T12:00:00Z",
          skip_next: false,
        },
        billing_history: [],
      }),
  },
}));

describe("SubscriptionManagementPage", () => {
  it("renders the management page", async () => {
    render(
      <Router>
        <SubscriptionManagementPage />
      </Router>,
    );

    // Wait for loading state to resolve
    const heading = await screen.findByText("My Subscription");
    expect(heading).toBeInTheDocument();
  });
});
