// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import TopNavBar from "./TopNavBar";
import { AuthProvider } from "../../context/AuthContext";

vi.mock("../../services/api.js", () => ({
  authService: {
    getMe: vi.fn().mockRejectedValue(new Error("No token")),
    logout: vi.fn(),
  },
}));

describe("TopNavBar Component", () => {
  it("renders brand name and login links when logged out", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <TopNavBar />
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Quick CV")).toBeInTheDocument();
    const loginLinks = screen.getAllByRole("link", { name: /Login/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute("href", "/login");
    expect(
      screen.getByRole("link", { name: /Sign In \/ Register/i }),
    ).toHaveAttribute("href", "/login");
  });
});
