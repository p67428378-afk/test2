import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App.jsx";

describe("Aura Studio App", () => {
  it("renders the header brand logo and navigation items", () => {
    render(<App />);
    const brandElements = screen.getAllByText(/Aura/i);
    expect(brandElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/Book Session/i)).toBeInTheDocument();
    expect(screen.getByText(/Photographer Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Session Tracker/i)).toBeInTheDocument();
  });

  it("renders customer session booking page by default", () => {
    render(<App />);
    expect(
      screen.getByText(/Book Your Photography Session/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Select Photography Package/i)).toBeInTheDocument();
  });
});
