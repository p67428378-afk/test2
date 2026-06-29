import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API service
vi.mock("./services/api.js", () => {
  return {
    getCourses: vi.fn().mockResolvedValue([
      {
        id: "1",
        title: "Introduction to Python",
        instructor_name: "Jane Doe",
        price: 49.99,
        description: "A beginner-friendly course on Python programming.",
      },
      {
        id: "2",
        title: "Advanced React & Tailwind",
        instructor_name: "John Smith",
        price: 79.99,
        description:
          "A sleek, minimalist digital composition illustrating advanced UI design concepts.",
      },
    ]),
  };
});

describe("LearnHub App Smoke Tests", () => {
  it("renders the main layout and header", async () => {
    render(<App />);

    // Check that the brand name is present
    const brandElements = screen.getAllByText("LearnHub");
    expect(brandElements.length).toBeGreaterThan(0);

    // Check that the hero banner title is present
    expect(screen.getByText("Expand Your Knowledge")).toBeInTheDocument();
  });

  it("renders the courses list after fetching", async () => {
    render(<App />);

    // Wait for the courses to load and render
    await waitFor(() => {
      expect(screen.getByText("Introduction to Python")).toBeInTheDocument();
      expect(screen.getByText("Advanced React & Tailwind")).toBeInTheDocument();
    });
  });

  it("navigates to course details page when clicking View Course", async () => {
    render(<App />);

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText("Introduction to Python")).toBeInTheDocument();
    });

    // Click the first "View Course" button
    const viewButtons = screen.getAllByText("View Course");
    fireEvent.click(viewButtons[0]);

    // Check that we are on the details page
    expect(screen.getByText("Back to Courses")).toBeInTheDocument();
    expect(screen.getByText("Course Details")).toBeInTheDocument();
    expect(screen.getByText("Course Curriculum")).toBeInTheDocument();
  });
});
