import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import React from "react";
import App from "./App";
import api from "./services/api";

vi.mock("./services/api", () => {
  return {
    default: {
      getTodos: vi.fn(),
      getTodo: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    },
    api: {
      getTodos: vi.fn(),
      getTodo: vi.fn(),
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
    },
  };
});

describe("TaskMaster TODO App", () => {
  const mockTodos = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Buy Groceries",
      description: "Milk, Eggs, Bread",
      completed: false,
      created_at: "2026-08-26T10:00:00Z",
      updated_at: "2026-08-26T10:00:00Z",
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174001",
      title: "Workout",
      description: "Go to gym",
      completed: true,
      created_at: "2026-08-26T08:00:00Z",
      updated_at: "2026-08-26T09:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getTodos.mockResolvedValue(mockTodos);
  });

  it("renders dashboard with navbar and statistics", async () => {
    render(<App />);

    expect(screen.getByText("TaskMaster TODOs")).toBeInTheDocument();
    expect(screen.getByText("Total Tasks")).toBeInTheDocument();
    expect(screen.getByText("Pending Tasks")).toBeInTheDocument();
    expect(screen.getByText("Completed Tasks")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Buy Groceries")).toBeInTheDocument();
      expect(screen.getByText("Workout")).toBeInTheDocument();
    });
  });

  it("filters tasks when status filter buttons are clicked", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Buy Groceries")).toBeInTheDocument();
    });

    const completedButtons = screen.getAllByRole("button", {
      name: /completed/i,
    });
    fireEvent.click(completedButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText("Buy Groceries")).not.toBeInTheDocument();
      expect(screen.getByText("Workout")).toBeInTheDocument();
    });
  });

  it("opens create modal when Create New Task button is clicked", async () => {
    render(<App />);

    const createBtn = screen.getByRole("button", { name: /create new task/i });
    fireEvent.click(createBtn);

    expect(
      screen.getByRole("heading", { name: /create new todo task/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/task title/i)).toBeInTheDocument();
  });

  it("submits a new task successfully", async () => {
    const newTodo = {
      id: "323e4567-e89b-12d3-a456-426614174002",
      title: "Read a book",
      description: "Chapter 1 to 3",
      completed: false,
      created_at: "2026-08-26T11:00:00Z",
      updated_at: "2026-08-26T11:00:00Z",
    };
    api.createTodo.mockResolvedValue(newTodo);

    render(<App />);

    const createBtn = screen.getByRole("button", { name: /create new task/i });
    fireEvent.click(createBtn);

    const titleInput = screen.getByLabelText(/task title/i);
    fireEvent.change(titleInput, { target: { value: "Read a book" } });

    const descInput = screen.getByLabelText(/description/i);
    fireEvent.change(descInput, { target: { value: "Chapter 1 to 3" } });

    const saveBtn = screen.getByRole("button", { name: /save task/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(api.createTodo).toHaveBeenCalledWith({
        title: "Read a book",
        description: "Chapter 1 to 3",
        completed: false,
      });
      expect(screen.getByText("Read a book")).toBeInTheDocument();
    });
  });

  it("toggles task completion status", async () => {
    api.updateTodo.mockResolvedValue({
      ...mockTodos[0],
      completed: true,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Buy Groceries")).toBeInTheDocument();
    });

    const toggleBtn = screen.getByRole("button", {
      name: /mark as completed/i,
    });
    fireEvent.click(toggleBtn);

    await waitFor(() => {
      expect(api.updateTodo).toHaveBeenCalledWith(mockTodos[0].id, {
        completed: true,
      });
    });
  });

  it("deletes a task after confirmation", async () => {
    api.deleteTodo.mockResolvedValue({});

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Buy Groceries")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete task/i,
    });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /^delete$/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(api.deleteTodo).toHaveBeenCalledWith(mockTodos[0].id);
      expect(screen.queryByText("Buy Groceries")).not.toBeInTheDocument();
    });
  });
});
