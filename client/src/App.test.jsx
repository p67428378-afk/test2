import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("DEMS Application Shell", () => {
  it("renders DEMS Portal title and navigation items", () => {
    render(<App />);
    expect(screen.getByText(/DEMS Portal/i)).toBeInDocument();
    expect(screen.getByText(/CJIS LEVEL 4 SECURED/i)).toBeInDocument();
    expect(screen.getAllByText(/Upload Evidence/i)[0]).toBeInDocument();
    expect(screen.getByText(/Chain of Custody/i)).toBeInDocument();
  });

  it("displays default test account credentials notice", () => {
    render(<App />);
    expect(screen.getByText(/test@example.com/i)).toBeInDocument();
    expect(screen.getByText(/testpassword/i)).toBeInDocument();
  });
});
