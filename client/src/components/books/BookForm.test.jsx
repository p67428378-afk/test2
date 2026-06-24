import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookForm from "./BookForm.jsx";

describe("BookForm Component", () => {
  it("renders the form fields correctly", () => {
    render(<BookForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ISBN/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Publication Date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Book/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when mandatory fields are empty", async () => {
    render(<BookForm onSubmit={vi.fn()} />);

    const saveButton = screen.getByRole("button", { name: /Save Book/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/ISBN is required/i)).toBeInTheDocument();
  });

  it("calls onSubmit with form data when valid", async () => {
    const handleSubmit = vi.fn().mockResolvedValue({});
    render(<BookForm onSubmit={handleSubmit} />);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: "The Great Gatsby" },
    });
    fireEvent.change(screen.getByLabelText(/Author/i), {
      target: { value: "F. Scott Fitzgerald" },
    });
    fireEvent.change(screen.getByLabelText(/ISBN/i), {
      target: { value: "9780743273565" },
    });
    fireEvent.change(screen.getByLabelText(/Publication Date/i), {
      target: { value: "2004-09-30" },
    });

    const saveButton = screen.getByRole("button", { name: /Save Book/i });
    fireEvent.click(saveButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      publication_date: "2004-09-30",
    });
  });
});
