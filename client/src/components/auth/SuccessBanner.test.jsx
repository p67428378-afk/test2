import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SuccessBanner from "./SuccessBanner";

describe("SuccessBanner Component", () => {
  it("renders success message when provided", () => {
    render(<SuccessBanner message="Account created successfully!" />);
    expect(
      screen.getByText("Account created successfully!"),
    ).toBeInTheDocument();
  });

  it("does not render when message is empty", () => {
    const { container } = render(<SuccessBanner message="" />);
    expect(container.firstChild).toBeNull();
  });
});
