import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  it("renders brand name and links", () => {
    render(
      <MemoryRouter>
        <Navbar user={{ email: "test@example.com" }} />
      </MemoryRouter>,
    );

    expect(screen.getByText("CineList")).toBeInTheDocument();
    expect(screen.getByText("Search Films")).toBeInTheDocument();
    expect(screen.getByText("My Dashboard")).toBeInTheDocument();
  });

  it("renders user email and initials", () => {
    render(
      <MemoryRouter>
        <Navbar user={{ email: "test@example.com" }} />
      </MemoryRouter>,
    );

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText("TE")).toBeInTheDocument();
  });
});
