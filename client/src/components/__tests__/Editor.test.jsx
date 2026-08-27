import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import EditorPage from "../../pages/EditorPage";
import FormattingToolbar from "../editor/FormattingToolbar";
import MarkdownEditorTextarea from "../editor/MarkdownEditorTextarea";
import LiveHTMLPreview from "../editor/LiveHTMLPreview";
import DocumentLibraryTable from "../documents/DocumentLibraryTable";

// Mock API calls
vi.mock("../../services/api", () => ({
  getDocuments: vi.fn(() => Promise.resolve([])),
  getDocument: vi.fn((id) =>
    Promise.resolve({
      id,
      title: "Mock Document.md",
      content: "# Mock Content\n\nTesting markdown.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  ),
  createDocument: vi.fn((data) =>
    Promise.resolve({
      id: "mock-uuid-1234",
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  ),
  updateDocument: vi.fn((id, data) =>
    Promise.resolve({
      id,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  ),
  deleteDocument: vi.fn(() => Promise.resolve({ ok: true })),
}));

describe("Browser Markdown Editor & Live Preview Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders EditorPage with header, toolbar, editor textarea, and live preview", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <EditorPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByPlaceholderText("Document Title.md"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Markdown Input")).toBeInTheDocument();
    expect(screen.getByText("LIVE HTML PREVIEW")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Save Document/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export \.md/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Export \.html/i }),
    ).toBeInTheDocument();
  });

  it("renders live HTML preview when Markdown text is entered", async () => {
    render(
      <LiveHTMLPreview markdownContent="# Live Header Test\n\n**Bold Text**" />,
    );

    // Heading 1 should be parsed into preview
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Live Header Test",
    );
    expect(screen.getByText("Bold Text")).toBeInTheDocument();
  });

  it("sanitizes malicious script tags to prevent XSS attacks in preview", async () => {
    const maliciousInput =
      '# Hello\n<script>window.__hacked = true;</script><img src="x" onerror="alert(1)">';
    const { container } = render(
      <LiveHTMLPreview markdownContent={maliciousInput} />,
    );

    // Script tags must be stripped by DOMPurify
    expect(container.querySelector("script")).toBeNull();
    const previewContainer = screen.getByTestId("live-preview-container");
    expect(previewContainer.innerHTML).not.toContain("<script>");
  });

  it("handles formatting toolbar button clicks correctly", async () => {
    const onFormat = vi.fn();
    render(<FormattingToolbar onFormat={onFormat} />);

    const boldBtn = screen.getByLabelText(/Bold/i);
    fireEvent.click(boldBtn);

    expect(onFormat).toHaveBeenCalledWith(
      expect.objectContaining({
        prefix: "**",
        suffix: "**",
      }),
    );
  });

  it("updates Markdown content on typing in editor textarea", () => {
    const onChange = vi.fn();
    render(<MarkdownEditorTextarea value="# Initial" onChange={onChange} />);

    const textarea = screen.getByLabelText("Markdown Input");
    fireEvent.change(textarea, { target: { value: "# Initial Updated" } });

    expect(onChange).toHaveBeenCalledWith("# Initial Updated");
  });

  it("renders DocumentLibraryTable with metrics and handles document actions", () => {
    const mockDocs = [
      {
        id: "doc-1",
        title: "Project Roadmap.md",
        content: "# Roadmap\n1. Launch v1\n2. Iterate",
        created_at: "2026-08-27T10:00:00Z",
        updated_at: "2026-08-27T12:00:00Z",
      },
    ];

    const onOpenDocument = vi.fn();
    const onDeleteDocument = vi.fn();
    const onNewDocument = vi.fn();

    render(
      <DocumentLibraryTable
        documents={mockDocs}
        loading={false}
        onOpenDocument={onOpenDocument}
        onDeleteDocument={onDeleteDocument}
        onNewDocument={onNewDocument}
      />,
    );

    expect(screen.getByText("Project Roadmap.md")).toBeInTheDocument();
    expect(screen.getByText("Total Documents")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL DB Connected")).toBeInTheDocument();

    // Click open document
    fireEvent.click(screen.getByText("Project Roadmap.md"));
    expect(onOpenDocument).toHaveBeenCalledWith(mockDocs[0]);
  });
});
