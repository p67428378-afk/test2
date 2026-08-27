// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./Navbar.jsx";

describe("Navbar Component", () => {
  it("renders brand and navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getByText("SPLI&TIP")).toBeInTheDocument();
    expect(screen.getByText("Calculator")).toBeInTheDocument();
    expect(screen.getByText("Breakdown Details")).toBeInTheDocument();
  });
});
