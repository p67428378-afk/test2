import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DashboardPage from "./DashboardPage";
import { reportService } from "../services/api";

// Mock the reportService
vi.mock("../services/api", () => ({
  reportService: {
    getDashboardMetrics: vi.fn(),
  },
}));

describe("DashboardPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    reportService.getDashboardMetrics.mockReturnValue(new Promise(() => {}));
    render(<DashboardPage onNewTask={vi.fn()} />);
    expect(screen.getByText(/Loading dashboard metrics/i)).toBeInTheDocument();
  });

  it("renders metrics correctly after loading", async () => {
    const mockMetrics = {
      total_tasks: 10,
      completed_tasks: 5,
      in_progress_tasks: 3,
      overdue_tasks: 2,
      tasks_by_priority: { High: 2, Med: 5, Low: 3 },
      completion_trend: [
        { day: "Mon", completed: 1 },
        { day: "Tue", completed: 2 },
      ],
    };

    reportService.getDashboardMetrics.mockResolvedValue(mockMetrics);

    render(<DashboardPage onNewTask={vi.fn()} />);

    const totalTasksElement = await screen.findByText("10");
    expect(totalTasksElement).toBeInTheDocument();

    const completedTasksElement = await screen.findByText("5");
    expect(completedTasksElement).toBeInTheDocument();
  });
});
