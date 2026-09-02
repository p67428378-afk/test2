import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";
import { authService } from "../services/api";

vi.mock("../services/api", () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ access_token: "mock-jwt-token" }),
    signup: vi
      .fn()
      .mockResolvedValue({ id: "user-123", email: "newuser@example.com" }),
    getMe: vi
      .fn()
      .mockResolvedValue({ email: "test@example.com", role: "member" }),
  },
}));

describe("Login Component (Unified AuthCard)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Sign In tab by default with test credentials", () => {
    render(
      <BrowserRouter>
        <Login initialTab="signin" />
      </BrowserRouter>,
    );

    expect(screen.getByText("Welcome to KeyCraft")).toBeInDocument();
    expect(screen.getByDisplayValue("test@example.com")).toBeInDocument();
    expect(screen.getByDisplayValue("testpassword")).toBeInDocument();
    expect(
      screen.getByRole("button", { name: /Sign In to Account/i }),
    ).toBeInDocument();
  });

  it("switches to Sign Up tab when clicking Sign Up tab button", () => {
    render(
      <BrowserRouter>
        <Login initialTab="signin" />
      </BrowserRouter>,
    );

    const signUpTabButtons = screen.getAllByRole("button", {
      name: /Sign Up/i,
    });
    fireEvent.click(signUpTabButtons[0]);

    expect(screen.getByText("Create an Account")).toBeInDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInDocument();
    expect(screen.getByPlaceholderText("newuser@example.com")).toBeInDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i }),
    ).toBeInDocument();
  });

  it("submits login form and invokes authService.login", async () => {
    const handleLoginSuccess = vi.fn();
    render(
      <BrowserRouter>
        <Login initialTab="signin" onLoginSuccess={handleLoginSuccess} />
      </BrowserRouter>,
    );

    const submitBtn = screen.getByRole("button", {
      name: /Sign In to Account/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "test@example.com",
        "testpassword",
      );
      expect(handleLoginSuccess).toHaveBeenCalled();
    });
  });

  it("validates minimum 8 characters password on Sign Up form", async () => {
    render(
      <BrowserRouter>
        <Login initialTab="signup" />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText("newuser@example.com");
    const passwordInput = screen.getByPlaceholderText("Minimum 8 characters");

    fireEvent.change(emailInput, { target: { value: "short@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "short" } });

    const createAccBtn = screen.getByRole("button", {
      name: /Create Account/i,
    });
    fireEvent.click(createAccBtn);

    expect(
      screen.getByText(/Password must be at least 8 characters long/i),
    ).toBeInDocument();
    expect(authService.signup).not.toHaveBeenCalled();
  });

  it("submits Sign Up form successfully with valid inputs", async () => {
    render(
      <BrowserRouter>
        <Login initialTab="signup" />
      </BrowserRouter>,
    );

    const nameInput = screen.getByPlaceholderText("John Doe");
    const emailInput = screen.getByPlaceholderText("newuser@example.com");
    const passwordInput = screen.getByPlaceholderText("Minimum 8 characters");

    fireEvent.change(nameInput, { target: { value: "Alice Smith" } });
    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "validpassword123" } });

    const createAccBtn = screen.getByRole("button", {
      name: /Create Account/i,
    });
    fireEvent.click(createAccBtn);

    await waitFor(() => {
      expect(authService.signup).toHaveBeenCalledWith(
        "alice@example.com",
        "validpassword123",
        "Alice Smith",
      );
      expect(
        screen.getByText(/Account created successfully!/i),
      ).toBeInDocument();
    });
  });
});
