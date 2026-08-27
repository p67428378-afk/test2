import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import FormattingToolbar from "./FormattingToolbar";

describe("FormattingToolbar Component", () => {
  it("renders all essential formatting buttons", () => {
    const handleApplyFormat = vi.fn();
    render(<FormattingToolbar onApplyFormat={handleApplyFormat} />);

    expect(
      screen.getByRole("toolbar", { name: /formatting toolbar/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Heading 1" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Heading 2" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Heading 3" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unordered List" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Insert Link" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Code Block" }),
    ).toBeInTheDocument();
  });

  it("calls onApplyFormat when clicking Bold button", () => {
    const handleApplyFormat = vi.fn();
    render(<FormattingToolbar onApplyFormat={handleApplyFormat} />);

    const boldBtn = screen.getByRole("button", { name: "Bold" });
    fireEvent.click(boldBtn);

    expect(handleApplyFormat).toHaveBeenCalledTimes(1);
    expect(handleApplyFormat).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "wrap",
        prefix: "**",
        suffix: "**",
      }),
    );
  });

  it("calls onApplyFormat when clicking Heading 1 button", () => {
    const handleApplyFormat = vi.fn();
    render(<FormattingToolbar onApplyFormat={handleApplyFormat} />);

    const h1Btn = screen.getByRole("button", { name: "Heading 1" });
    fireEvent.click(h1Btn);

    expect(handleApplyFormat).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "line-prefix",
        prefix: "# ",
      }),
    );
  });
});
