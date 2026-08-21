import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

// Mock the API services to avoid real network calls during tests
vi.mock("./services/api", () => {
  return {
    authService: {
      isAuthenticated: () => false,
      login: vi.fn(),
      logout: vi.fn(),
    },
    learningService: {
      getItems: () =>
        Promise.resolve([
          {
            id: "1",
            type: "alphabet",
            value: "A",
            word_association: "Apple",
            image_url: "",
            audio_url: "",
          },
          {
            id: "2",
            type: "number",
            value: "1",
            word_association: "One",
            image_url: "",
            audio_url: "",
          },
        ]),
    },
    progressService: {
      getProgress: () =>
        Promise.resolve({ total_stars: 0, explored_item_ids: [] }),
      logProgress: vi.fn(),
      resetProgress: vi.fn(),
    },
    default: {
      interceptors: {
        request: { use: vi.fn() },
      },
    },
  };
});

describe("ToddlerLearn App Smoke Tests", () => {
  it("renders the main application and header", async () => {
    render(<App />);

    // Check if the header title is present
    const titleElement = await screen.findByText(/ToddlerLearn/i);
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the navigation tabs", async () => {
    render(<App />);

    // Check if Letters and Numbers tabs are present
    const lettersTab = await screen.findByRole("button", { name: /Letters/i });
    const numbersTab = await screen.findByRole("button", { name: /Numbers/i });

    expect(lettersTab).toBeInTheDocument();
    expect(numbersTab).toBeInTheDocument();
  });
});
