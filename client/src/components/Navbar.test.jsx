import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./layout/Navbar";

describe("Navbar Component", () => {
  it("renders navigation links and branding", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText("BeeHive Monitor")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Hives Inventory")).toBeInTheDocument();
    expect(screen.getByText("Harvest Tracker")).toBeInTheDocument();
    expect(screen.getByText("Disease Reports")).toBeInTheDocument();
    expect(screen.getByText("Inspections")).toBeInTheDocument();
  });
});
