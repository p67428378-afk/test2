// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock API calls
vi.mock("./services/api.js", () => ({
  getDocuments: vi.fn(() => Promise.resolve([])),
  getDocument: vi.fn(() =>
    Promise.resolve({ id: "1", title: "Test.md", content: "# Hi" }),
  ),
  createDocument: vi.fn(() => Promise.resolve({ id: "1" })),
  updateDocument: vi.fn(() => Promise.resolve({ id: "1" })),
  deleteDocument: vi.fn(() => Promise.resolve({ ok: true })),
  checkHealth: vi.fn(() => Promise.resolve({ status: "ok" })),
  default: {
    getDocuments: vi.fn(() => Promise.resolve([])),
  },
}));

describe("App Root Component", () => {
  it("renders Navbar and EditorPage by default", () => {
    render(<App />);

    expect(screen.getByText("Markdown Studio")).toBeInTheDocument();
    expect(screen.getAllByText("Editor").length).toBeGreaterThan(0);
    expect(screen.getByText("Library")).toBeInTheDocument();
  });
});
