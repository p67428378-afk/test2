import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  it("renders branding and primary navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar userId="test-user-456" cartCount={2} />
      </BrowserRouter>,
    );

    expect(screen.getByText("RecomCommerce")).toBeInTheDocument();
    expect(screen.getByText("Product Catalog")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("AI Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Saved Items")).toBeInTheDocument();
    expect(screen.getByText("test-user-456")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
