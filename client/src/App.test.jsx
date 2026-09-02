import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders navbar branding and navigation links", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(screen.getAllByText(/ArchExcav/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3D Trench/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PWA Sync/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/QR Custody/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ML Classify/i).length).toBeGreaterThan(0);
  });
});
