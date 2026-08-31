import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App Component", () => {
  it("renders without crashing and displays the museum navigation and heading", async () => {
    render(<App />);
    const museumElements = screen.getAllByText(/Museum/i);
    expect(museumElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Browse & Book/i)).toBeInTheDocument();
  });
});
