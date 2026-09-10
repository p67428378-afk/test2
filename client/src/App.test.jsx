import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

describe("App Component", () => {
  it("renders application navigation header", () => {
    render(<App />);
    expect(screen.getByText(/TechKnowledge Hub/i)).toBeInTheDocument();
  });
});
