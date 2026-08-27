import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import DocumentTable from "./DocumentTable";

describe("DocumentTable Component", () => {
  const mockDocuments = [
    {
      id: "1111-2222-3333-4444",
      title: "Project Architecture",
      content: "# Architecture",
      created_at: "2026-08-01T10:00:00Z",
      updated_at: "2026-08-02T12:00:00Z",
    },
    {
      id: "5555-6666-7777-8888",
      title: "Release Notes",
      content: "## v1.0 Notes",
      created_at: "2026-08-03T10:00:00Z",
      updated_at: "2026-08-04T12:00:00Z",
    },
  ];

  it("renders document items with titles", () => {
    render(
      <MemoryRouter>
        <DocumentTable
          documents={mockDocuments}
          total={2}
          skip={0}
          limit={20}
          onDeleteDocument={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText("Project Architecture")).toBeInTheDocument();
    expect(screen.getByText("Release Notes")).toBeInTheDocument();
  });

  it("filters documents when typing in search input", () => {
    render(
      <MemoryRouter>
        <DocumentTable
          documents={mockDocuments}
          total={2}
          skip={0}
          limit={20}
          onDeleteDocument={vi.fn()}
        />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText(
      /Search documents by title/i,
    );
    fireEvent.change(searchInput, { target: { value: "Release" } });

    expect(screen.queryByText("Project Architecture")).not.toBeInTheDocument();
    expect(screen.getByText("Release Notes")).toBeInTheDocument();
  });

  it("handles delete confirmation flow", () => {
    const handleDelete = vi.fn();
    render(
      <MemoryRouter>
        <DocumentTable
          documents={mockDocuments}
          total={2}
          skip={0}
          limit={20}
          onDeleteDocument={handleDelete}
        />
      </MemoryRouter>,
    );

    const deleteButtons = screen.getAllByTitle(/Delete document/i);
    fireEvent.click(deleteButtons[0]);

    // Should prompt for confirmation
    const confirmBtn = screen.getByText(/Confirm Delete\?/i);
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);
    expect(handleDelete).toHaveBeenCalledWith("1111-2222-3333-4444");
  });
});
