import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LiveHTMLPreviewPane from "./LiveHTMLPreviewPane";

describe("LiveHTMLPreviewPane Component", () => {
  it("renders converted HTML from Markdown correctly", () => {
    const markdown = "# Sample Title\n\nThis is **bold** text.";
    render(
      <LiveHTMLPreviewPane markdown={markdown} enableSanitization={true} />,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Sample Title" }),
    ).toBeInTheDocument();
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("sanitizes malicious script tags via DOMPurify", () => {
    const maliciousMarkdown = 'Safe text <script>alert("xss")</script>';
    render(
      <LiveHTMLPreviewPane
        markdown={maliciousMarkdown}
        enableSanitization={true}
      />,
    );

    expect(screen.getByText(/Safe text/i)).toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });

  it("toggles between Visual preview and HTML code mode", () => {
    const markdown = "## Subheading";
    render(<LiveHTMLPreviewPane markdown={markdown} />);

    expect(
      screen.getByRole("heading", { level: 2, name: "Subheading" }),
    ).toBeInTheDocument();

    const htmlCodeBtn = screen.getByRole("button", { name: /HTML Code/i });
    fireEvent.click(htmlCodeBtn);

    expect(screen.getByText(/<h2.*>Subheading<\/h2>/i)).toBeInTheDocument();
  });
});
