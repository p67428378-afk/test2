// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock API service to avoid real network calls during testing
vi.mock("./services/api.js", () => {
  return {
    resumeService: {
      getTemplates: vi.fn().mockResolvedValue([
        {
          id: "classic",
          name: "Classic",
          description: "Traditional serif layout",
          category: "Standard",
        },
        {
          id: "modern",
          name: "Modern",
          description: "Contemporary layout",
          category: "Standard",
        },
      ]),
      listResumes: vi.fn().mockResolvedValue([]),
      getResume: vi.fn(),
      createResume: vi.fn().mockResolvedValue({ id: "test-uuid-123" }),
      updateResume: vi.fn().mockResolvedValue({ id: "test-uuid-123" }),
      deleteResume: vi.fn().mockResolvedValue(null),
      exportPdf: vi
        .fn()
        .mockResolvedValue(
          new Blob(["test pdf content"], { type: "application/pdf" }),
        ),
      healthCheck: vi.fn().mockResolvedValue({ status: "ok" }),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("Quick Resume Maker App Component", () => {
  it("renders the main application header and branding", () => {
    render(<App />);
    expect(screen.getAllByText(/Quick Resume Maker/i).length).toBeGreaterThan(
      0,
    );
    expect(
      screen.getByRole("button", { name: /Export PDF/i }),
    ).toBeInTheDocument();
  });

  it("renders the resume editor form with contact fields", () => {
    render(<App />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Portfolio \/ LinkedIn URL/i),
    ).toBeInTheDocument();
  });

  it("allows switching tabs in the resume editor", () => {
    render(<App />);

    // Click Experience tab
    const experienceTab = screen.getByRole("button", { name: /Experience/i });
    fireEvent.click(experienceTab);
    expect(
      screen.getByRole("button", { name: /Add Position/i }),
    ).toBeInTheDocument();

    // Click Education tab
    const educationTab = screen.getByRole("button", { name: /Education/i });
    fireEvent.click(educationTab);
    expect(
      screen.getByRole("button", { name: /Add Education/i }),
    ).toBeInTheDocument();

    // Click Skills tab
    const skillsTab = screen.getByRole("button", { name: /Skills/i });
    fireEvent.click(skillsTab);
    expect(screen.getByPlaceholderText(/Type a skill/i)).toBeInTheDocument();

    // Click Template tab
    const templateTab = screen.getByRole("button", { name: /Template/i });
    fireEvent.click(templateTab);
    expect(screen.getByText(/Classic Template/i)).toBeInTheDocument();
    expect(screen.getByText(/Modern Template/i)).toBeInTheDocument();
  });

  it("renders the live document preview", () => {
    render(<App />);
    expect(screen.getByText(/Live Document Preview/i)).toBeInTheDocument();
  });
});
