import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock API calls to prevent network errors in vitest
vi.mock("./services/api", () => ({
  authAPI: {
    getCurrentUser: vi.fn(() => null),
    getMe: vi.fn(() => Promise.reject(new Error("Unauthenticated"))),
    logout: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
  campaignsAPI: {
    getCampaigns: vi.fn(() =>
      Promise.resolve({
        items: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            title: "Emergency Medical Drive",
            description: "Provide medical supplies for local clinics.",
            target_amount: 10000,
            current_amount: 2500,
            category: "Medical",
            status: "Active",
            end_date: "2026-12-31T00:00:00Z",
            supporter_count: 15,
          },
        ],
        total: 1,
      }),
    ),
    getCampaign: vi.fn(() =>
      Promise.resolve({
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Emergency Medical Drive",
        description: "Provide medical supplies for local clinics.",
        target_amount: 10000,
        current_amount: 2500,
        category: "Medical",
        status: "Active",
        end_date: "2026-12-31T00:00:00Z",
        supporter_count: 15,
      }),
    ),
  },
  donationsAPI: {
    getDonations: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
    createDonation: vi.fn(),
    getMyDonations: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
  },
  default: {},
}));

describe("GiveHope Donation Portal App", () => {
  it("renders brand header without crashing", async () => {
    render(<App />);
    const brandElements = screen.getAllByText(/GiveHope Portal/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it("renders campaigns search bar and filter controls", async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(
      /Search campaigns by title or description/i,
    );
    expect(searchInput).toBeInTheDocument();
  });
});
