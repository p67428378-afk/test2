// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api.js", () => {
  return {
    authService: {
      getCurrentUser: vi.fn().mockRejectedValue(new Error("No token")),
      login: vi.fn(),
      logout: vi.fn(),
    },
    busService: {
      getRoutes: vi.fn().mockResolvedValue([]),
      getRouteStops: vi.fn().mockResolvedValue([]),
      getRouteBuses: vi.fn().mockResolvedValue([]),
      getStopEta: vi.fn().mockResolvedValue({ etas: [] }),
    },
    bookService: {
      getBooks: vi.fn().mockResolvedValue([]),
    },
    memberService: {
      getMembers: vi.fn().mockResolvedValue([]),
    },
    loanService: {
      getMemberLoans: vi.fn().mockResolvedValue([]),
    },
    fineService: {
      getFines: vi.fn().mockResolvedValue([]),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("App Component", () => {
  it("renders the login form when not authenticated", async () => {
    render(<App />);

    // Check that the welcome message is displayed
    expect(screen.getByText("Welcome to TransitMax")).toBeInTheDocument();
    expect(
      screen.getByText("Real-Time Bus Tracking & Transit System"),
    ).toBeInTheDocument();

    // Check that the email and password inputs are present
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();

    // Check that the sign in button is present
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });
});
