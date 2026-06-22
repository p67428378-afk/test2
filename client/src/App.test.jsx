import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services
vi.mock("./services/api", () => ({
  authService: {
    getMe: vi.fn().mockResolvedValue(null),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
  packageService: {
    getPackages: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getPackage: vi.fn(),
  },
  bookingService: {
    createBooking: vi.fn(),
    getBooking: vi.fn(),
    getUserBookings: vi.fn().mockResolvedValue([]),
  },
  paymentService: {
    processPayment: vi.fn(),
  },
  default: {
    interceptors: {
      request: { use: vi.fn() },
    },
  },
}));

describe("App Smoke Test", () => {
  it("renders App component without crashing", () => {
    render(<App />);
    expect(screen.getByText("RoamEase")).toBeInTheDocument();
    expect(screen.getByText("Explore Packages")).toBeInTheDocument();
  });
});
