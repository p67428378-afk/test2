import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API calls to prevent network requests during tests
vi.mock("./services/api.js", () => ({
  getRules: vi.fn(() => Promise.resolve([])),
  getWorkflowDetails: vi.fn(() => Promise.resolve(null)),
}));

describe("App Component Smoke Test", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText(/ApexTreasury/i)).toBeInTheDocument();
  });
});
