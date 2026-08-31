import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App Root Integration Test", () => {
  it("renders the main application layout and branding", () => {
    render(<App />);
    expect(
      screen.getAllByText(/MBBS Digital Learning/i)[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Student Learning Dashboard/i)[0],
    ).toBeInTheDocument();
  });

  it("renders navigation links for Anatomy and Animations", () => {
    render(<App />);
    expect(screen.getAllByText(/Anatomy Viewer/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Digital Animations/i)[0]).toBeInTheDocument();
  });
});
