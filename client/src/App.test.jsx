import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App.jsx";

describe("App Smoke Test", () => {
  it("renders login form when not authenticated", () => {
    render(<App />);
    expect(screen.getByText(/Institutional Portal Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Test Credentials/i)).toBeInTheDocument();
  });
});
