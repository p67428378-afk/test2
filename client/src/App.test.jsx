import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing and displays brand header", () => {
    render(<App />);
    expect(screen.getByText("ConfManage")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<App />);
    expect(screen.getByText("Conferences")).toBeInTheDocument();
    expect(screen.getByText("Submit Proposal")).toBeInTheDocument();
    expect(screen.getByText("Review Portal")).toBeInTheDocument();
    expect(screen.getByText("Public Agenda")).toBeInTheDocument();
  });
});
