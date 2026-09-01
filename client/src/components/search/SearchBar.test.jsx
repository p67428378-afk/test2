import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  it("renders search input and button correctly", () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(
      screen.getByPlaceholderText(/Search by address/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Search Open Spots/i)).toBeInTheDocument();
  });

  it("calls onSearch when search button is clicked", () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    const button = screen.getByRole("button", { name: /Search Open Spots/i });
    fireEvent.click(button);
    expect(handleSearch).toHaveBeenCalledWith({
      address: expect.any(String),
    });
  });
});
