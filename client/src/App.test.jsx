import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import App from "./App";
import PasswordGenerator from "./components/PasswordGenerator";
import StrengthMeter from "./components/StrengthMeter";

vi.mock("./services/api", () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ access_token: "mock-jwt-token" }),
    signup: vi
      .fn()
      .mockResolvedValue({ id: "user-123", email: "newuser@example.com" }),
    getMe: vi
      .fn()
      .mockResolvedValue({ email: "test@example.com", role: "member" }),
    logout: vi.fn(),
  },
  passwordService: {
    generatePassword: vi.fn().mockResolvedValue({
      password: "MockSecurePassword123!",
      length: 20,
      entropy_bits: 120.5,
      strength: "Very Strong",
      generated_at: "2026-05-18T12:00:00Z",
    }),
    generateBatch: vi.fn().mockResolvedValue([
      {
        password: "BatchKey1!",
        length: 16,
        entropy_bits: 100,
        strength: "Very Strong",
      },
    ]),
  },
  healthService: {
    checkHealth: vi.fn().mockResolvedValue({
      status: "healthy",
      service: "KeyCraft API",
      timestamp: "2026-05-18T12:00:00Z",
    }),
  },
}));

describe("KeyCraft Password Generator Application", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("redirects unauthenticated user to Login page by default", () => {
    render(<App />);
    expect(screen.getByText("Welcome to KeyCraft")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In to Account/i }),
    ).toBeInTheDocument();
  });

  it("renders KeyCraft title and header navigation when authenticated", async () => {
    localStorage.setItem("token", "mock-jwt-token");
    render(<App />);
    await waitFor(() => {
      expect(screen.getAllByText(/KeyCraft/i).length).toBeGreaterThan(0);
      expect(screen.getByText("Generator")).toBeInTheDocument();
      expect(screen.getByText("Batch Keys")).toBeInTheDocument();
      expect(screen.getByText("API Docs")).toBeInTheDocument();
    });
  });

  it("renders PasswordGenerator component with length slider and controls", async () => {
    render(<PasswordGenerator />);
    expect(screen.getByText(/Customization Controls/i)).toBeInTheDocument();
    expect(screen.getByText(/Password Length/i)).toBeInTheDocument();
    expect(screen.getByText(/Uppercase Letters/i)).toBeInTheDocument();
    expect(screen.getByText(/Lowercase Letters/i)).toBeInTheDocument();
    expect(screen.getByText(/Digits \/ Numbers/i)).toBeInTheDocument();
    expect(screen.getByText(/Special Symbols/i)).toBeInTheDocument();
  });

  it("renders StrengthMeter component accurately", () => {
    render(<StrengthMeter strength="Very Strong" entropyBits={104.8} />);
    expect(screen.getByText("Very Strong")).toBeInTheDocument();
    expect(screen.getByText(/Entropy: 104.8 bits/i)).toBeInTheDocument();
  });

  it("switches tabs when clicking navigation buttons in authenticated view", async () => {
    localStorage.setItem("token", "mock-jwt-token");
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Batch Keys")).toBeInTheDocument();
    });

    const batchTab = screen.getByText("Batch Keys");
    fireEvent.click(batchTab);
    expect(screen.getByText(/Batch Size/i)).toBeInTheDocument();

    const apiTab = screen.getByText("API Docs");
    fireEvent.click(apiTab);
    expect(screen.getByText(/API Endpoint Tester/i)).toBeInTheDocument();
  });
});
