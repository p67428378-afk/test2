import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import DashboardPage from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders main dashboard layout", () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Registered Roster")).toBeInTheDocument();
    expect(screen.getByText("Current Round")).toBeInTheDocument();
    expect(screen.getByText("Tournament Status")).toBeInTheDocument();
  });
});
