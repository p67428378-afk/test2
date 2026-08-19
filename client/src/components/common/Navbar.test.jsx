import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./Navbar.jsx";

describe("Navbar", () => {
  it("renders logo and navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText(/WiFi Tracker/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Maintenance Logs/i)).toBeInTheDocument();
    expect(screen.getAllByText(/ADMIN/i).length).toBeGreaterThan(0);
  });
});
