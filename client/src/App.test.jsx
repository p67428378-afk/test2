import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders App and redirects to register page", () => {
    render(<App />);
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
  });
});
