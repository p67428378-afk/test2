import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthForm from "./AuthForm";

describe("AuthForm Component", () => {
  it("renders login form by default with test credentials", () => {
    render(<AuthForm onAuthSuccess={vi.fn()} />);

    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toHaveValue(
      "test@example.com",
    );
    expect(screen.getByLabelText("Password")).toHaveValue("testpassword");
    expect(screen.getByText("Test Account Credentials:")).toBeInTheDocument();
  });

  it("switches to sign up tab", () => {
    render(<AuthForm onAuthSuccess={vi.fn()} />);

    const signUpTab = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(signUpTab);

    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(
      screen.queryByText("Test Account Credentials:"),
    ).not.toBeInTheDocument();
  });
});
