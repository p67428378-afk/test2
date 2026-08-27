import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  it("renders branding title and navigation links", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar documentCount={5} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Markdown/i)).toBeInTheDocument();
    expect(screen.getByText(/Studio/i)).toBeInTheDocument();
    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.getByText("New Document")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders correctly when document count is zero", () => {
    render(
      <MemoryRouter initialEntries={["/editor"]}>
        <Navbar documentCount={0} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Library")).toBeInTheDocument();
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });
});
