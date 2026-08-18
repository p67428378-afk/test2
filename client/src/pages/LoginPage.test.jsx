import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "./LoginPage";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../services/api", () => ({
  authAPI: {
    login: vi.fn(),
  },
}));

describe("LoginPage Component", () => {
  it("renders login form and pre-configured test role buttons", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(
      screen.getByRole("heading", { name: /Sign In/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Visitor/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Guide/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Admin/i })).toBeInTheDocument();
  });
});
