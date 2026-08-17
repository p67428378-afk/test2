// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api.js", () => {
  return {
    itemService: {
      getItems: vi.fn().mockResolvedValue([]),
      getItemMatches: vi.fn().mockResolvedValue([]),
    },
    claimService: {
      getClaims: vi.fn().mockResolvedValue([]),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("App Component", () => {
  it("renders the dashboard page", async () => {
    render(<App />);

    // Check that the dashboard header is displayed
    expect(screen.getByText("Lost & Found Items")).toBeInTheDocument();
    expect(
      screen.getByText("Browse reported items or report a new one."),
    ).toBeInTheDocument();
  });
});
