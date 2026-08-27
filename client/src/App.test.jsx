import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock api service calls
vi.mock("./services/api", () => ({
  fetchDocuments: vi
    .fn()
    .mockResolvedValue({ total: 0, skip: 0, limit: 20, items: [] }),
  getDocument: vi
    .fn()
    .mockResolvedValue({
      id: "1",
      title: "Mock",
      content: "# Mock",
      created_at: "",
      updated_at: "",
    }),
  createDocument: vi
    .fn()
    .mockResolvedValue({
      id: "1",
      title: "Mock",
      content: "# Mock",
      created_at: "",
      updated_at: "",
    }),
  updateDocument: vi
    .fn()
    .mockResolvedValue({
      id: "1",
      title: "Mock",
      content: "# Mock",
      created_at: "",
      updated_at: "",
    }),
  deleteDocument: vi.fn().mockResolvedValue({}),
}));

describe("App Component Routes", () => {
  it("renders Document Library page on root route", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Document Library" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Saved Documents")).toBeInTheDocument();
  });

  it("renders Editor Workspace page on /editor route", async () => {
    render(
      <MemoryRouter initialEntries={["/editor"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText("Markdown Source")).toBeInTheDocument();
    expect(screen.getAllByText(/Live HTML Preview/i).length).toBeGreaterThan(0);
  });
});
