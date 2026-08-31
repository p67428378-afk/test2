import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AnimationPlayer from "../components/player/AnimationPlayer";

describe("AnimationPlayer Component", () => {
  const mockCheckpoints = [
    {
      id: "cp1",
      timestamp_seconds: 75,
      question_text: "What event marks ventricular systole?",
      options: ["Closure of AV valves (S1)", "Opening of aortic valve"],
      correct_option: 0,
    },
  ];

  it("renders player controls and checkpoint sidebar", () => {
    render(
      <AnimationPlayer
        moduleData={{
          title: "Cardiac Cycle Mechanics",
          animation_url: "https://example.com/cardiac.mp4",
        }}
        checkpoints={mockCheckpoints}
      />,
    );

    expect(screen.getByText(/Checkpoint Quizzes/i)).toBeInTheDocument();
    expect(
      screen.getByText(/What event marks ventricular systole/i),
    ).toBeInTheDocument();
  });
});
