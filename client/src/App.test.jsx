import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Smoke Test", () => {
  it("renders application navbar and main layout successfully", () => {
    render(<App />);
    expect(screen.getByText(/Podcast Hub/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Find Your Next Favorite Podcast/i),
    ).toBeInTheDocument();
  });
});
