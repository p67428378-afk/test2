import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API services
vi.mock("./services/api.js", () => ({
  getTasks: vi.fn(() => Promise.resolve([])),
  updateTaskStatus: vi.fn(() => Promise.resolve({})),
  getWebSocketUrl: vi.fn(() => "ws://localhost:8000/ws/v1/worklist"),
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe("SyncTask App Smoke Test", () => {
  it("renders the application without crashing", async () => {
    render(<App />);

    // Check if the logo/brand name is present
    const logoElements = screen.getAllByText("SyncTask");
    expect(logoElements.length).toBeGreaterThan(0);

    // Check if the sidebar navigation links are present
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Task List")).toBeInTheDocument();
    expect(screen.getByText("Create Task")).toBeInTheDocument();
  });
});
