import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

// Mock the API service
vi.mock("./services/api", () => ({
  getNotes: vi.fn(() => Promise.resolve([])),
  getNote: vi.fn(() => Promise.resolve(null)),
  createNote: vi.fn(() =>
    Promise.resolve({ id: "1", title: "New Note", content: "", tags: [] }),
  ),
  updateNote: vi.fn(() => Promise.resolve({})),
  deleteNote: vi.fn(() => Promise.resolve({})),
  uploadAttachment: vi.fn(() => Promise.resolve({})),
  deleteAttachment: vi.fn(() => Promise.resolve({})),
  getStats: vi.fn(() =>
    Promise.resolve({ total_notes: 0, active_tags: 0, storage_usage_bytes: 0 }),
  ),
  getAttachments: vi.fn(() => Promise.resolve([])),
  getTags: vi.fn(() => Promise.resolve([])),
}));

describe("App Component Smoke Test", () => {
  it("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("NoteFlow")).toBeInTheDocument();
    expect(screen.getByText("Digital Craftsmanship")).toBeInTheDocument();
  });
});
