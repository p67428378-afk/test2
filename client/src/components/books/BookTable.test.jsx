import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BookTable from "./BookTable.jsx";

describe("BookTable Component", () => {
  it("renders loading state correctly", () => {
    render(<BookTable books={[]} isLoading={true} />);
    expect(screen.getByText(/Loading books.../i)).toBeInTheDocument();
  });

  it("renders empty state correctly", () => {
    render(<BookTable books={[]} isLoading={false} />);
    expect(
      screen.getByText(/No books found in the catalog./i),
    ).toBeInTheDocument();
  });

  it("renders a list of books correctly", () => {
    const mockBooks = [
      {
        id: "1",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        isbn: "9780743273565",
        publication_date: "2004-09-30",
        status: "Available",
      },
    ];

    render(<BookTable books={mockBooks} isLoading={false} />);

    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
    expect(screen.getByText("9780743273565")).toBeInTheDocument();
    expect(screen.getByText("2004-09-30")).toBeInTheDocument();
    expect(screen.getByText("Available")).toBeInTheDocument();
  });
});
