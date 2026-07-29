import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services to prevent real network calls during tests
vi.mock("./services/api", () => ({
  authService: {
    getCurrentUser: vi.fn(() => null),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  itemService: {
    createItem: vi.fn(),
    getFoundItems: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
    getLostItemMatches: vi.fn(() => Promise.resolve({ matches: [] })),
  },
  claimService: {
    createClaim: vi.fn(),
  },
  adminService: {
    getAllClaims: vi.fn(() => Promise.resolve({ claims: [], total: 0 })),
    updateClaimStatus: vi.fn(),
    getAllItems: vi.fn(() => Promise.resolve({ items: [], total: 0 })),
    getAllUsers: vi.fn(() => Promise.resolve({ users: [], total: 0 })),
  },
  default: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

describe("App Component Smoke Test", () => {
  it("renders login page when unauthenticated", () => {
    render(<App />);
    expect(
      screen.getByText(/Sign in to ReclaimAI Lost & Found/i),
    ).toBeInTheDocument();
  });
});
