import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import TaskDashboardPage from "./TaskDashboardPage";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  getCurrentUser: vi.fn(),
  getProjects: vi.fn(),
  getTasks: vi.fn(),
  getTaskAnalytics: vi.fn(),
  getProductivityAnalytics: vi.fn(),
  getEscalations: vi.fn(),
}));

describe("TaskDashboardPage Component", () => {
  it("renders dashboard with analytics cards and data table", async () => {
    api.getCurrentUser.mockResolvedValue({
      id: "u1",
      email: "test@example.com",
      full_name: "Test User",
      role: "Admin",
    });
    api.getProjects.mockResolvedValue([
      { id: "p1", name: "Q3 Analytics", status: "Planning" },
    ]);
    api.getTasks.mockResolvedValue([
      {
        id: "t1",
        summary: "Build API schema",
        priority: "High",
        status: "In Progress",
      },
    ]);
    api.getTaskAnalytics.mockResolvedValue({
      total_tasks: 1,
      completed_tasks: 0,
      in_progress_tasks: 1,
      completion_rate: 0.0,
    });
    api.getProductivityAnalytics.mockResolvedValue({
      average_cycle_time_hours: 2.5,
      productivity_by_assignee: [],
    });
    api.getEscalations.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <TaskDashboardPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /task management dashboard/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/build api schema/i)).toBeInTheDocument();
    });
  });
});
