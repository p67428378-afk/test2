import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { AuthProvider } from "../context/AuthContext";

// Mock API services
vi.mock("../services/api", () => ({
  authAPI: {
    getCurrentUser: vi
      .fn()
      .mockResolvedValue({
        id: "1",
        full_name: "Alex Student",
        role: "student",
      }),
    logout: vi.fn(),
  },
  coursesAPI: {
    listCourses: vi
      .fn()
      .mockResolvedValue([
        {
          id: "c1",
          course_code: "CS101",
          title: "Intro to CS",
          semester: "Fall 2026",
        },
      ]),
    enrollInCourse: vi.fn(),
  },
  enrollmentsAPI: {
    getMyEnrollments: vi.fn().mockResolvedValue([]),
  },
  assignmentsAPI: {
    listAssignments: vi.fn().mockResolvedValue([]),
  },
}));

describe("Dashboard Page", () => {
  it("renders student dashboard header and course sections", async () => {
    render(
      <AuthProvider>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(await screen.findByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Enrolled Courses/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Course Catalog & Enrollment/i),
    ).toBeInTheDocument();
  });
});
