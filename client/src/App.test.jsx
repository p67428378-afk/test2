import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import App from "./App.jsx";
import * as api from "./services/api.js";

// Mock the API service
vi.mock("./services/api.js", () => ({
  getSubjects: vi.fn(),
  getVersions: vi.fn(),
  getValidationLogs: vi.fn(),
  registerVersion: vi.fn(),
}));

describe("SchemaFlow App Smoke Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially and then displays dashboard", async () => {
    api.getSubjects.mockResolvedValue([
      { id: "1", name: "user-events", compatibility_level: "BACKWARD" },
    ]);
    api.getVersions.mockResolvedValue([
      {
        id: "v1-id",
        subject_id: "1",
        version: 1,
        schema_definition: { type: "record", name: "UserEvent", fields: [] },
        created_at: "2026-05-19T14:20:05Z",
      },
    ]);
    api.getValidationLogs.mockResolvedValue([
      {
        id: "log-1",
        timestamp: "2026-05-19T14:20:05Z",
        subject: "user-events",
        attempted_version: "v1",
        change_type: "Initial registration",
        compatibility_level: "BACKWARD",
        status: "PASSED",
        error_details: null,
      },
    ]);

    render(<App />);

    // Verify loading state is shown
    expect(
      screen.getByText(/Loading Schema Registry Dashboard.../i),
    ).toBeInTheDocument();

    // Wait for dashboard to load
    await waitFor(() => {
      expect(screen.getByText("SchemaFlow")).toBeInTheDocument();
    });

    // Verify key elements are present
    expect(screen.getByText("Active Subjects")).toBeInTheDocument();
    expect(screen.getByText("Total Schema Versions")).toBeInTheDocument();
    expect(
      screen.getByText("Compatibility Validation Logs"),
    ).toBeInTheDocument();
  });
});
