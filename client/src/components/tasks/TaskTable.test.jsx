import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import TaskTable from "./TaskTable";

describe("TaskTable Component", () => {
  const sampleTasks = [
    {
      id: "task-1",
      title: "Replace HVAC Filter",
      description: "Quarterly filter replacement",
      category_id: "cat-1",
      priority: "High",
      estimated_cost: 25,
      actual_cost: 0,
      due_date: "2026-06-01",
      status: "Pending",
      assigned_user_id: "user-1",
    },
  ];

  const sampleCategories = [{ id: "cat-1", name: "HVAC" }];
  const sampleUsers = [
    { id: "user-1", full_name: "John Doe", email: "john@example.com" },
  ];

  it("renders task list with title and details correctly", () => {
    render(
      <BrowserRouter>
        <TaskTable
          tasks={sampleTasks}
          categories={sampleCategories}
          users={sampleUsers}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("Replace HVAC Filter")).toBeInTheDocument();
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    expect(screen.getByText("HVAC")).toBeInTheDocument();
  });

  it("displays empty state when task array is empty", () => {
    render(
      <BrowserRouter>
        <TaskTable tasks={[]} />
      </BrowserRouter>,
    );

    expect(screen.getByText("No tasks found")).toBeInTheDocument();
  });
});
