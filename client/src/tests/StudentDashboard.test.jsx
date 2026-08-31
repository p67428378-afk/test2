import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import StudentDashboard from "../pages/StudentDashboard";

describe("StudentDashboard Component", () => {
  it("renders KPI cards and subject filters", async () => {
    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>,
    );

    expect(
      screen.getAllByText(/Student Learning Dashboard/i)[0],
    ).toBeInTheDocument();
    expect(screen.getByText(/Enrolled Modules/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Score/i)).toBeInTheDocument();
    expect(screen.getByText(/All Subjects/i)).toBeInTheDocument();
  });

  it("renders search bar and subject filter tabs", () => {
    render(
      <BrowserRouter>
        <StudentDashboard />
      </BrowserRouter>,
    );

    expect(
      screen.getByPlaceholderText(/Search modules or structures/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Anatomy/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Physiology/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Biochemistry/i)[0]).toBeInTheDocument();
  });
});
