import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PasswordStrengthBar from "./PasswordStrengthBar";

describe("PasswordStrengthBar Component", () => {
  it("renders password strength bar", () => {
    render(<PasswordStrengthBar password="" />);
    expect(screen.getByText(/Password Strength:/i)).toBeInTheDocument();
  });

  it("shows Weak for short passwords", () => {
    render(<PasswordStrengthBar password="123" />);
    expect(screen.getByText("Weak")).toBeInTheDocument();
  });

  it("shows Strong for complex passwords", () => {
    render(<PasswordStrengthBar password="ComplexPassword123!" />);
    expect(screen.getByText("Strong")).toBeInTheDocument();
  });
});
