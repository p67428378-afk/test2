import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PaginationBar from "./PaginationBar";

describe("PaginationBar Component", () => {
  it("renders pagination info and enables navigation buttons", () => {
    const handlePageChange = vi.fn();
    render(
      <PaginationBar
        total={50}
        skip={10}
        limit={10}
        onPageChange={handlePageChange}
      />,
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    expect(screen.getByText(/showing/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(20);

    const prevBtn = screen.getByRole("button", { name: /previous/i });
    fireEvent.click(prevBtn);
    expect(handlePageChange).toHaveBeenCalledWith(0);
  });

  it("renders nothing when total is within single page", () => {
    const { container } = render(
      <PaginationBar total={5} skip={0} limit={20} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
