import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "./TaskCard";

describe("TaskCard Component", () => {
  const mockTask = {
    id: "123",
    title: "Test Task",
    description: "Test Description",
    priority: "High",
    status: "To Do",
    due_date: "2026-07-04T00:00:00.000Z",
    assignee_id: "user-123",
  };

  it("renders task details correctly", () => {
    render(
      <TaskCard
        task={mockTask}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
