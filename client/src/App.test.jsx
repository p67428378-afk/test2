import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App.jsx";

describe("HabitHero Kids Frontend App", () => {
  it("renders login page title when unauthenticated", () => {
    render(<App />);
    expect(screen.getByText(/HabitHero Kids/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it("renders test credentials note on login screen", () => {
    render(<App />);
    expect(screen.getByText(/Test Account:/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
