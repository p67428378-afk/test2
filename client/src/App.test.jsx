import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import App from "./App";
import { authService } from "./services/api";

// Mock authService
vi.mock("./services/api", () => {
  return {
    authService: {
      register: vi.fn(),
      login: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
      isAuthenticated: vi.fn(),
    },
    default: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

describe("LoginPage & Remember Me Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login page with title, test credentials, and Remember Me checkbox", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    // Check if title is rendered
    expect(screen.getByText("Beekeeper Pro")).toBeInTheDocument();

    // Check if test credentials note is present
    expect(screen.getByText("Username:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();

    // Check if Remember Me checkbox is present
    expect(screen.getByText("Remember me for 30 days")).toBeInTheDocument();
  });

  it("submits login form with rememberMe as false by default", async () => {
    authService.login.mockResolvedValue({
      access_token: "fake-token",
      user: { username: "testuser" },
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "testuser",
        "testpassword",
        false,
      );
    });
  });

  it("submits login form with rememberMe as true when checked", async () => {
    authService.login.mockResolvedValue({
      access_token: "fake-token",
      user: { username: "testuser" },
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "testuser",
        "testpassword",
        true,
      );
    });
  });
});

describe("App Session Restoration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("attempts to restore session on startup if not authenticated", async () => {
    authService.isAuthenticated.mockReturnValue(false);
    authService.refreshToken.mockResolvedValue({
      access_token: "new-token",
      user: { username: "testuser" },
    });

    render(<App />);

    // Should show loading state initially
    expect(screen.getByText("Restoring Session...")).toBeInTheDocument();

    await waitFor(() => {
      expect(authService.refreshToken).toHaveBeenCalled();
    });
  });
});
