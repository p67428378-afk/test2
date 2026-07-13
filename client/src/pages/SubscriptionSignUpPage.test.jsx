import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import SubscriptionSignUpPage from "./SubscriptionSignUpPage";

// Mock the services
vi.mock("../services/api", () => ({
  authService: {
    isAuthenticated: () => true,
    getCurrentUserEmail: () => "test@example.com",
  },
  subscriptionService: {
    createSubscription: vi.fn(),
  },
}));

describe("SubscriptionSignUpPage", () => {
  it("renders the sign up page with size and frequency selectors", () => {
    render(
      <Router>
        <SubscriptionSignUpPage />
      </Router>,
    );

    expect(
      screen.getByText("Craft Your Chocolate Journey"),
    ).toBeInTheDocument();
    expect(screen.getByText("Step 1: Choose Box Size")).toBeInTheDocument();
    expect(screen.getByText("Step 2: Delivery Frequency")).toBeInTheDocument();
    expect(screen.getByText("Step 3: Secure Payment")).toBeInTheDocument();
  });
});
