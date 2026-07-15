import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App";
import { authService, passwordService } from "./services/api";

// Mock the API services
vi.mock("./services/api", () => {
  return {
    authService: {
      isAuthenticated: vi.fn(),
      getUserEmail: vi.fn(),
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    },
    passwordService: {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      generate: vi.fn(),
    },
    default: {
      create: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("Fortress Password Manager App Smoke Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login page by default when not authenticated", () => {
    authService.isAuthenticated.mockReturnValue(false);
    render(<App />);
    expect(screen.getByText("Welcome to Fortress")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("navigates to register page when clicking create account", () => {
    authService.isAuthenticated.mockReturnValue(false);
    render(<App />);
    const registerBtn = screen.getByText("Create one now");
    fireEvent.click(registerBtn);
    expect(screen.getByText("Create Master Account")).toBeInTheDocument();
  });

  it("renders dashboard when authenticated", async () => {
    authService.isAuthenticated.mockReturnValue(true);
    authService.getUserEmail.mockReturnValue("test@example.com");
    passwordService.getAll.mockResolvedValue([
      {
        id: "1",
        title: "Google",
        username: "user1",
        password: "password123",
        url: "google.com",
      },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("My Password Vault")).toBeInTheDocument();
    });
    expect(screen.getByText("Google")).toBeInTheDocument();
  });
});
