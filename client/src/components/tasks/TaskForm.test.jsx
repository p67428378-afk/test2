import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskForm from "./TaskForm.jsx";

describe("TaskForm Component", () => {
  it("renders the form with title and assignee fields", () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Task Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Assignee/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Task/i }),
    ).toBeInTheDocument();
  });

  it("shows validation error when submitting empty title", async () => {
    render(<TaskForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole("button", { name: /Create Task/i });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/Task title is required/i),
    ).toBeInTheDocument();
  });

  it("calls onSubmit with form data when valid", () => {
    const handleSubmit = vi.fn();
    render(<TaskForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/Task Title/i);
    const assigneeSelect = screen.getByLabelText(/Assignee/i);
    const submitButton = screen.getByRole("button", { name: /Create Task/i });

    fireEvent.change(titleInput, { target: { value: "New Test Task" } });
    fireEvent.change(assigneeSelect, { target: { value: "Alex Rivera" } });
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "New Test Task",
      assignee: "Alex Rivera",
    });
  });
});
