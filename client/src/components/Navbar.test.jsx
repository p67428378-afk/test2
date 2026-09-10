import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  it("renders brand name and navigation items", () => {
    render(<Navbar activeTab="studio" setActiveTab={vi.fn()} totalCount={5} />);

    expect(screen.getByText("EmailClassify")).toBeInTheDocument();
    expect(screen.getByText("Classify Studio")).toBeInTheDocument();
    expect(screen.getByText("Review Dashboard")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls setActiveTab when clicking on tabs", () => {
    const handleSetActiveTab = vi.fn();
    render(
      <Navbar
        activeTab="studio"
        setActiveTab={handleSetActiveTab}
        totalCount={0}
      />,
    );

    const dashboardBtn = screen.getByText("Review Dashboard");
    fireEvent.click(dashboardBtn);

    expect(handleSetActiveTab).toHaveBeenCalledWith("dashboard");
  });
});
