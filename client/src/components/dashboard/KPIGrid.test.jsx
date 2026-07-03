import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KPIGrid from "./KPIGrid";

describe("KPIGrid Component", () => {
  it("renders all KPI cards with correct values", () => {
    render(
      <KPIGrid
        totalStudents={150}
        attendanceRate={94.5}
        absentToday={5}
        unexcused={2}
      />,
    );

    expect(screen.getByText("Total Students")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    expect(screen.getByText("Attendance Rate")).toBeInTheDocument();
    expect(screen.getByText("94.5%")).toBeInTheDocument();

    expect(screen.getByText("Absent Today")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("Unexcused Absences")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
