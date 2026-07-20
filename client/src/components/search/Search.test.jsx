import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchFilterBar from "./SearchFilterBar.jsx";
import BookCard from "./BookCard.jsx";
import BookGrid from "./BookGrid.jsx";
import EmptyState from "./EmptyState.jsx";

describe("Search Components Tests", () => {
  describe("SearchFilterBar", () => {
    it("renders input and select elements", () => {
      const mockOnSearch = vi.fn();
      render(
        <SearchFilterBar onSearch={mockOnSearch} initialQuery="Tolkien" />,
      );

      expect(
        screen.getByPlaceholderText(/Type to search/i),
      ).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("calls onSearch when search button is clicked", () => {
      const mockOnSearch = vi.fn();
      render(
        <SearchFilterBar onSearch={mockOnSearch} initialQuery="Tolkien" />,
      );

      const searchButton = screen.getByRole("button", { name: /Search/i });
      fireEvent.click(searchButton);

      expect(mockOnSearch).toHaveBeenCalledWith({
        query: "Tolkien",
        searchBy: "all",
      });
    });
  });

  describe("BookCard", () => {
    const mockBook = {
      id: "1",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      isbn: "978-0345391803",
      available_copies: 3,
      total_copies: 5,
      is_available: true,
      genre: "Fantasy",
    };

    it("renders book details correctly", () => {
      render(<BookCard book={mockBook} />);

      expect(screen.getByText("The Hobbit")).toBeInTheDocument();
      expect(screen.getByText("J.R.R. Tolkien")).toBeInTheDocument();
      expect(screen.getByText(/ISBN: 978-0345391803/i)).toBeInTheDocument();
    });
  });

  describe("BookGrid", () => {
    const mockBooks = [
      {
        id: "1",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "978-0345391803",
        available_copies: 3,
        total_copies: 5,
        is_available: true,
        genre: "Fantasy",
      },
    ];

    it("renders a grid of book cards", () => {
      render(<BookGrid books={mockBooks} />);
      expect(screen.getByText("The Hobbit")).toBeInTheDocument();
    });
  });

  describe("EmptyState", () => {
    it("renders empty state message", () => {
      render(<EmptyState query="UnknownBook" />);
      expect(screen.getByText(/No books found/i)).toBeInTheDocument();
      expect(screen.getByText(/UnknownBook/i)).toBeInTheDocument();
    });
  });
});
