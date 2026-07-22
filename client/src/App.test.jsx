import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("LoginPage Smoke Test", () => {
  it("renders login page with title and test credentials", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    // Check if title is rendered
    expect(screen.getByText("Beekeeper Pro")).toBeInTheDocument();

    // Check if test credentials note is present
    expect(screen.getByText("Username: testuser")).toBeInTheDocument();
    expect(screen.getByText("Password: testpassword")).toBeInTheDocument();
  });
});
