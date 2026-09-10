// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ResumeFormEditor, { SAMPLE_RESUME_DATA } from "./ResumeFormEditor";

describe("ResumeFormEditor Component", () => {
  it("renders with contact info and navigation tabs", () => {
    const handleChange = vi.fn();
    render(
      <ResumeFormEditor
        resumeData={SAMPLE_RESUME_DATA}
        onChange={handleChange}
      />,
    );

    expect(screen.getByText(/Resume Form Editor/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Contact Info/i }),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("jane.doe@example.com"),
    ).toBeInTheDocument();
  });

  it("switches tabs to experience and allows adding position", () => {
    const handleChange = vi.fn();
    render(
      <ResumeFormEditor
        resumeData={SAMPLE_RESUME_DATA}
        onChange={handleChange}
      />,
    );

    const expTab = screen.getByRole("button", { name: /Experience/i });
    fireEvent.click(expTab);

    expect(screen.getByText(/Work Experience/i)).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: /Add Position/i });
    fireEvent.click(addBtn);

    expect(handleChange).toHaveBeenCalled();
  });

  it("switches tabs to education and skills", () => {
    const handleChange = vi.fn();
    render(
      <ResumeFormEditor
        resumeData={SAMPLE_RESUME_DATA}
        onChange={handleChange}
      />,
    );

    const eduTab = screen.getByRole("button", { name: /Education/i });
    fireEvent.click(eduTab);
    expect(
      screen.getByRole("button", { name: /Add Education/i }),
    ).toBeInTheDocument();

    const skillsTab = screen.getByRole("button", { name: /Skills/i });
    fireEvent.click(skillsTab);
    expect(screen.getByPlaceholderText(/Type a skill/i)).toBeInTheDocument();
  });
});
