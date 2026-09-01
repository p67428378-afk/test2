import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import App from "./App";
import PasswordGenerator from "./components/PasswordGenerator";
import StrengthMeter from "./components/StrengthMeter";

vi.mock("./services/api", () => ({
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
  });

  it("renders KeyCraft title and header navigation", async () => {
    render(<App />);
    expect(screen.getAllByText(/KeyCraft/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Generator")).toBeInDocument();
    expect(screen.getByText("Batch Keys")).toBeInDocument();
    expect(screen.getByText("API Docs")).toBeInDocument();
  });

  it("renders PasswordGenerator component with length slider and controls", async () => {
    render(<PasswordGenerator />);
    expect(screen.getByText(/Customization Controls/i)).toBeInDocument();
    expect(screen.getByText(/Password Length/i)).toBeInDocument();
    expect(screen.getByText(/Uppercase Letters/i)).toBeInDocument();
    expect(screen.getByText(/Lowercase Letters/i)).toBeInDocument();
    expect(screen.getByText(/Digits \/ Numbers/i)).toBeInDocument();
    expect(screen.getByText(/Special Symbols/i)).toBeInDocument();
  });

  it("renders StrengthMeter component accurately", () => {
    render(<StrengthMeter strength="Very Strong" entropyBits={104.8} />);
    expect(screen.getByText("Very Strong")).toBeInDocument();
    expect(screen.getByText(/Entropy: 104.8 bits/i)).toBeInDocument();
  });

  it("switches tabs when clicking navigation buttons", async () => {
    render(<App />);
    const batchTab = screen.getByText("Batch Keys");
    fireEvent.click(batchTab);
    expect(screen.getByText(/Batch Size/i)).toBeInDocument();

    const apiTab = screen.getByText("API Docs");
    fireEvent.click(apiTab);
    expect(screen.getByText(/API Endpoint Tester/i)).toBeInDocument();
  });
});
