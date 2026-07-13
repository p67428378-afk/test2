import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

// Mock the API services
vi.mock("./services/api", () => {
  return {
    authService: {
      getCurrentUser: vi.fn(() => null),
      logout: vi.fn(),
    },
    credentialsService: {
      getAll: vi.fn(() => Promise.resolve([])),
    },
    passwordService: {
      generate: vi.fn(() =>
        Promise.resolve({ password: "mocked-password", strength: "Strong" }),
      ),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("App Component Smoke Test", () => {
  it("renders login page by default when not authenticated", () => {
    render(<App />);
    expect(screen.getByText(/Unlock Vault/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Username \/ Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Master Password/i)).toBeInTheDocument();
  });
});
