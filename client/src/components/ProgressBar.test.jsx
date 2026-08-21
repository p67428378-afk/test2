import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgressBar from "./ProgressBar";

describe("ProgressBar Component", () => {
  it("renders progress text correctly", () => {
    render(<ProgressBar current={2} total={5} />);
    expect(screen.getByText("2 of 5 cards")).toBeInTheDocument();
  });
});
