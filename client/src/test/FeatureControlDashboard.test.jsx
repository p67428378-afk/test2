import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FeatureControlDashboard from "../components/features/FeatureControlDashboard.jsx";

// Mock featureService and dashboardService
vi.mock("../services/api.js", () => ({
  featureService: {
    getFeatures: vi.fn().mockResolvedValue([
      {
        id: "feat-1",
        feature_name: "Automated Slot Hold Release",
        status: "Active",
        configuration: { autoHoldMins: 15 },
        created_at: "2026-01-01T00:00:00Z",
      },
    ]),
    createFeature: vi.fn().mockResolvedValue({ id: "feat-2" }),
    updateFeature: vi.fn().mockResolvedValue({ id: "feat-1" }),
    deleteFeature: vi.fn().mockResolvedValue({}),
  },
  dashboardService: {
    getMetrics: vi.fn().mockResolvedValue({
      active_features: 1,
      total_sessions: 42,
    }),
    getStatusWidgets: vi
      .fn()
      .mockResolvedValue([
        { title: "System Health", value: "99.9%", status: "ok" },
      ]),
  },
}));

describe("FeatureControlDashboard", () => {
  it("renders status widgets and feature table", async () => {
    render(<FeatureControlDashboard />);

    expect(
      screen.getByText(/Interactive Control Dashboard & Status Widgets/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("Automated Slot Hold Release"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Active Features")).toBeInTheDocument();
    expect(screen.getByText("Add Studio Feature")).toBeInTheDocument();
  });
});
