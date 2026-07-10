import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

vi.mock("../services/api", () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(() => ({ token: null, role: null, userId: null })),
  },
}));

describe("Authentication Pages", () => {
  it("renders login page correctly", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    expect(screen.getByText("Sign in to PVMS")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("test@example.com")).toBeInTheDocument();
  });

  it("renders register page correctly", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );
    expect(screen.getByText("Create Visitor Profile")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
  });
});
