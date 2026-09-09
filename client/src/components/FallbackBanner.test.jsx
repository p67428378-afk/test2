import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import FallbackBanner from "./FallbackBanner";

describe("FallbackBanner Component", () => {
  it("renders fallback banner text and CTA button", () => {
    render(
      <BrowserRouter>
        <FallbackBanner message="Showing top-selling products." />
      </BrowserRouter>,
    );

    expect(screen.getByText("Popular Trending Products")).toBeInTheDocument();
    expect(
      screen.getByText(/showing top-selling products/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Set Preferences")).toBeInTheDocument();
  });
});
