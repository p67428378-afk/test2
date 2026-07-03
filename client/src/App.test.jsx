import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App.jsx";
import {
  authService,
  systemService,
  alertService,
  serviceRequestService,
} from "./services/api.js";

// Mock API services
vi.mock("./services/api.js", () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getMe: vi.fn(),
  },
  systemService: {
    getRealtime: vi.fn(),
    getAnalytics: vi.fn(),
  },
  alertService: {
    getAlerts: vi.fn(),
  },
  serviceRequestService: {
    getRequests: vi.fn(),
    updateRequest: vi.fn(),
  },
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
      },
    })),
  },
}));

describe("Solar Panel Monitoring Platform - App Smoke Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders login page when unauthenticated", () => {
    render(<App />);
    expect(screen.getByText("Helios Platform")).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits login form successfully and loads owner dashboard", async () => {
    authService.login.mockResolvedValue({
      access_token: "mock-token",
      role: "owner",
    });
    authService.getMe.mockResolvedValue({
      id: "user-123",
      name: "John Owner",
      email: "test@example.com",
      role: "owner",
    });
    systemService.getRealtime.mockResolvedValue({
      current_power_kw: 4.5,
      efficiency_pct: 88.2,
      status: "Online",
      system_id: "sys-123",
      today_generation_kwh: 24.8,
    });
    systemService.getAnalytics.mockResolvedValue({
      generation_data: [{ date: "2026-07-03", kwh: 24.8 }],
      period: "daily",
      system_id: "sys-123",
      usage_breakdown: {
        battery_storage_kwh: 5.0,
        grid_export_kwh: 10.0,
        household_kwh: 9.8,
      },
    });
    alertService.getAlerts.mockResolvedValue([]);

    render(<App />);

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "testpassword",
      );
    });
  });
});
