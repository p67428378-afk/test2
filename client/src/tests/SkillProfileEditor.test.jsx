import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SkillProfileEditor from "../components/SkillProfileEditor.jsx";

describe("SkillProfileEditor component", () => {
  const mockProfile = {
    teach_skills: [
      {
        id: "s-1",
        skill_name: "Python",
        proficiency: "EXPERT",
        type: "TEACH",
        category: "Programming",
      },
    ],
    learn_skills: [
      {
        id: "s-2",
        skill_name: "React",
        proficiency: "BEGINNER",
        type: "LEARN",
        category: "Frontend",
      },
    ],
  };

  it("renders teach and learn skill lists correctly", () => {
    render(
      <SkillProfileEditor
        profile={mockProfile}
        onSkillAdded={vi.fn()}
        onSkillRemoved={vi.fn()}
      />,
    );

    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Add New Skill")).toBeInTheDocument();
  });

  it("calls onSkillAdded when submitting the skill form", async () => {
    const handleAdd = vi.fn().mockResolvedValue({});
    render(
      <SkillProfileEditor
        profile={mockProfile}
        onSkillAdded={handleAdd}
        onSkillRemoved={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText(
      /Search skill or partner name|e.g. React, Python/i,
    );
    fireEvent.change(input, { target: { value: "FastAPI" } });

    const submitBtn = screen.getByRole("button", { name: /Add Skill/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleAdd).toHaveBeenCalledWith(
        expect.objectContaining({
          skill_name: "FastAPI",
          type: "TEACH",
          proficiency: "INTERMEDIATE",
        }),
      );
    });
  });
});
