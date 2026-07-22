import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "./Sidebar.jsx";

describe("Sidebar Component", () => {
  it("renders sidebar title and navigation links", () => {
    render(
      <Router>
        <Sidebar onNewMissionClick={vi.fn()} />
      </Router>,
    );

    expect(screen.getByText("AstroTrack")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Components")).toBeInTheDocument();
    expect(screen.getByText("Missions")).toBeInTheDocument();
  });
});
