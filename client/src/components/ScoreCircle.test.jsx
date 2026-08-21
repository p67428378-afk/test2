import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ScoreCircle from "./ScoreCircle";

describe("ScoreCircle Component", () => {
  it("renders score percentage and fraction", () => {
    render(<ScoreCircle score={4} total={5} />);
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("4 / 5 correct")).toBeInTheDocument();
  });
});
