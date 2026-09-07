import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import App from "../App";

// Mock API module so tests run standalone without network calls
vi.mock("../services/api", () => ({
  getGenres: vi.fn().mockResolvedValue([
    {
      code: "cyberpunk",
      display_name: "Cyberpunk",
      description: "Futuristic names",
    },
    { code: "fantasy", display_name: "Fantasy", description: "Mythical names" },
  ]),
  generateNames: vi.fn().mockResolvedValue({
    genre: "cyberpunk",
    quantity: 5,
    names: ["Kaelen Cross", "Aria Vance", "Neo Mercer", "Jax Reed", "Cyra Vex"],
    generated_at: new Date().toISOString(),
  }),
}));

describe("App Component", () => {
  it("renders the brand title and navigation links", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(screen.getByText(/NameForge AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Generator/i)).toBeInTheDocument();
    expect(screen.getByText(/Favorites/i)).toBeInTheDocument();
    expect(screen.getByText(/Genre Directory/i)).toBeInTheDocument();
  });

  it("renders generator controls on the dashboard page", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Generator Controls/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Generate Unique Names/i }),
    ).toBeInTheDocument();
  });
});
