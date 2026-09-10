// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import AuthCard from "./AuthCard";
import { AuthProvider } from "../../context/AuthContext";

vi.mock("../../services/api.js", () => ({
  authService: {
    login: vi.fn().mockResolvedValue({
      access_token: "mock-token",
      user: { id: "1", email: "test@example.com", full_name: "Test" },
    }),
    register: vi.fn().mockResolvedValue({
      id: "2",
      email: "reg@example.com",
    }),
    getMe: vi.fn().mockResolvedValue({ id: "1", email: "test@example.com" }),
    logout: vi.fn(),
  },
}));

describe("AuthCard Component", () => {
  it("renders login form with default credentials and switch tab", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthCard />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/Quick CV Authentication/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue(
      "test@example.com",
    );
    expect(screen.getByLabelText(/Password/i)).toHaveValue("testpassword");
    expect(
      screen.getByRole("button", { name: /Sign In to Quick CV/i }),
    ).toBeInTheDocument();
  });

  it("toggles between Sign In and Create Account tabs", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <AuthCard />
        </AuthProvider>
      </BrowserRouter>,
    );

    const regTab = screen.getByRole("tab", { name: /Create Account/i });
    fireEvent.click(regTab);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Account/i }),
    ).toBeInTheDocument();

    const loginTab = screen.getByRole("tab", { name: /Sign In/i });
    fireEvent.click(loginTab);

    expect(screen.queryByLabelText(/Full Name/i)).not.toBeInTheDocument();
  });
});
