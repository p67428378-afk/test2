// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LiveResumePreview from "./LiveResumePreview";
import { SAMPLE_RESUME_DATA } from "./ResumeFormEditor";

describe("LiveResumePreview Component", () => {
  it("renders classic template layout with user details", () => {
    render(
      <LiveResumePreview
        resumeData={{ ...SAMPLE_RESUME_DATA, template_id: "classic" }}
      />,
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("jane.doe@example.com")).toBeInTheDocument();
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/Stanford University/i)).toBeInTheDocument();
  });

  it("renders modern template layout when selected", () => {
    render(
      <LiveResumePreview
        resumeData={{ ...SAMPLE_RESUME_DATA, template_id: "modern" }}
      />,
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Tech Corp Solutions")).toBeInTheDocument();
  });
});
