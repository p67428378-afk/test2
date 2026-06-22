import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API calls to prevent network requests during tests
vi.mock("./services/api", () => ({
  getGalleries: vi.fn(() => Promise.resolve([])),
  getGalleryImages: vi.fn(() => Promise.resolve([])),
  getAvailability: vi.fn(() => Promise.resolve([])),
}));

describe("App Component Smoke Test", () => {
  it("renders without crashing", () => {
    render(<App />);
    // Verify that the header title is present
    const headerTitle = screen.getByText("Aura Lens Photography");
    expect(headerTitle).toBeInTheDocument();
  });
});
