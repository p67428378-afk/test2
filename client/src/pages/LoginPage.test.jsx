import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import LoginPage from "./LoginPage";

describe("LoginPage Component", () => {
  it("renders login form with pre-filled credentials", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/Email Address/i)).toHaveValue(
      "test@example.com",
    );
    expect(screen.getByLabelText(/Password/i)).toHaveValue("testpassword");
  });

  it("submits login form successfully", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(
      await screen.findByText("Logged in successfully! Welcome to the system."),
    ).toBeInTheDocument();
  });
});
