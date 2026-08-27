import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AudioProvider } from "../../context/AudioContext";
import StickyAudioPlayer from "./StickyAudioPlayer";

describe("StickyAudioPlayer Component", () => {
  it("does not render when no episode is currently playing", () => {
    const { container } = render(
      <AudioProvider>
        <BrowserRouter>
          <StickyAudioPlayer />
        </BrowserRouter>
      </AudioProvider>,
    );

    expect(
      container.querySelector('[data-testid="sticky-audio-player"]'),
    ).toBeNull();
  });
});
