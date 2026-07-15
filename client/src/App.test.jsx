import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

// Mock the API services to prevent actual network requests during tests
vi.mock("./services/api", () => {
  return {
    authService: {
      isAuthenticated: vi.fn(() => false),
      login: vi.fn(),
      register: vi.fn(),
    },
    propertyService: {
      getAll: vi.fn(() => Promise.resolve([])),
      getById: vi.fn(),
    },
    inquiryService: {
      submit: vi.fn(),
    },
    brokerService: {
      getDashboard: vi.fn(),
    },
    default: {
      create: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("Homely App Smoke Test", () => {
  it("renders the main client portal page with search header", async () => {
    render(<App />);

    // Verify that the main brand logo is rendered
    expect(screen.getByText(/Homely/i)).toBeInTheDocument();

    // Verify that the main search header is rendered
    expect(screen.getByText(/Find Your Dream Home/i)).toBeInTheDocument();
  });
});
