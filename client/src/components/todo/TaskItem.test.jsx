import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskItem from "./TaskItem.jsx";

describe("TaskItem component", () => {
  const mockTask = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Buy groceries and meal prep",
    description: "Milk, organic eggs, sourdough bread",
    completed: false,
    created_at: "2026-08-25T10:15:00Z",
    updated_at: "2026-08-25T10:15:00Z",
  };

  it("renders task title, description, and status correctly", () => {
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Buy groceries and meal prep")).toBeInTheDocument();
    expect(
      screen.getByText("Milk, organic eggs, sourdough bread"),
    ).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("triggers onToggleComplete when checkbox button is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={handleToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const toggleButton = screen.getByLabelText("Mark as completed");
    fireEvent.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
    expect(handleToggle).toHaveBeenCalledWith(mockTask);
  });

  it("triggers onEdit callback when Edit button is clicked", () => {
    const handleEdit = vi.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={vi.fn()}
        onEdit={handleEdit}
        onDelete={vi.fn()}
      />,
    );

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(mockTask);
  });

  it("triggers onDelete callback with task id when Delete button is clicked", () => {
    const handleDelete = vi.fn();
    render(
      <TaskItem
        task={mockTask}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={handleDelete}
      />,
    );

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it("renders completed styling and badge when task is completed", () => {
    const completedTask = { ...mockTask, completed: true };
    render(
      <TaskItem
        task={completedTask}
        onToggleComplete={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByLabelText("Mark as active")).toBeInTheDocument();
  });
});
