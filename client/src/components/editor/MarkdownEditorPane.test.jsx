import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MarkdownEditorPane from "./MarkdownEditorPane";

describe("MarkdownEditorPane Component", () => {
  it("renders textarea with initial markdown content and stats", () => {
    const handleChange = vi.fn();
    const content = "# Hello World\nThis is markdown.";

    render(<MarkdownEditorPane content={content} onChange={handleChange} />);

    const textarea = screen.getByLabelText(/Markdown Input/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe(content);
    expect(screen.getByText(/2 lines/i)).toBeInTheDocument();
  });

  it("triggers onChange when user types in textarea", () => {
    const handleChange = vi.fn();
    render(<MarkdownEditorPane content="" onChange={handleChange} />);

    const textarea = screen.getByLabelText(/Markdown Input/i);
    fireEvent.change(textarea, { target: { value: "## New Heading" } });

    expect(handleChange).toHaveBeenCalledWith("## New Heading");
  });

  it("shows size status info", () => {
    render(<MarkdownEditorPane content="Short text" onChange={() => {}} />);
    expect(screen.getByText(/Size:/i)).toBeInTheDocument();
  });
});
