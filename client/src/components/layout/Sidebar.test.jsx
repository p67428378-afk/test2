import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Sidebar from "./Sidebar.jsx";

describe("Sidebar Component", () => {
  it("renders brand name and tabs", () => {
    render(<Sidebar activeTab="dashboard" setActiveTab={() => {}} />);
    expect(screen.getByText("OceanOS")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Schedules")).toBeInTheDocument();
    expect(screen.getByText("Expeditions")).toBeInTheDocument();
    expect(screen.getByText("Equipment")).toBeInTheDocument();
    expect(screen.getByText("Samples")).toBeInTheDocument();
  });

  it("calls setActiveTab when a tab is clicked", () => {
    const setActiveTabMock = vi.fn();
    render(<Sidebar activeTab="dashboard" setActiveTab={setActiveTabMock} />);

    const schedulesButton = screen.getByText("Schedules");
    fireEvent.click(schedulesButton);

    expect(setActiveTabMock).toHaveBeenCalledWith("schedules");
  });
});
