import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

describe("App Component Smoke Test", () => {
  it("renders login page when not authenticated", () => {
    render(<App />);
    expect(
      screen.getByText(/Sign in to manage your worklist/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/testuser \/ testpassword/i)).toBeInTheDocument();
  });
});
