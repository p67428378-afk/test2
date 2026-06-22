import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API service
vi.mock("./services/api.js", () => {
  return {
    getGreetings: vi.fn().mockResolvedValue([
      {
        id: "1",
        greeting: "Namaste",
        region: "Widespread",
        description: "A respectful greeting.",
      },
    ]),
    default: {
      get: vi.fn(),
    },
  };
});

describe("App Smoke Test", () => {
  it("renders the main dashboard and heading", async () => {
    render(<App />);

    // Check that the header title is present
    const heading = screen.getByText("Namaste India");
    expect(heading).toBeInTheDocument();

    // Wait for the mocked greeting to load and render
    await waitFor(() => {
      expect(screen.getByText("Namaste")).toBeInTheDocument();
    });
  });
});
