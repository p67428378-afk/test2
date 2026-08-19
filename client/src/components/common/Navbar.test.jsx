import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  it("renders application branding and links", () => {
    render(
      <BrowserRouter>
        <Navbar onOpenRegisterModal={() => {}} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Warranty Tracker")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Service Claims")).toBeInTheDocument();
  });
});
