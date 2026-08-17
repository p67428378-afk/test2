import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders login page by default when not authenticated", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /Sign In/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
