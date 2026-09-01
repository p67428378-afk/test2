import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "./LoginPage";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  loginUser: vi.fn(),
}));

describe("LoginPage Component", () => {
  it("renders login form properly", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /log in to taskflow/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/user@example.com/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("handles login form submission and token storage", async () => {
    api.loginUser.mockResolvedValueOnce({ access_token: "fake-jwt-token" });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const submitBtn = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith({
        username: "test@example.com",
        password: "testpassword",
      });
      expect(localStorage.getItem("token")).toBe("fake-jwt-token");
    });
  });
});
