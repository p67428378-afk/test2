import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock the API service
vi.mock("./services/api.js", () => ({
  searchBooks: vi.fn().mockResolvedValue({
    items: [
      {
        id: "1",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "978-0345391803",
        available_copies: 3,
        total_copies: 5,
        is_available: true,
        genre: "Fantasy",
      },
    ],
    limit: 10,
    page: 1,
    pages: 1,
    total: 1,
  }),
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("App Component Smoke Test", () => {
  it("renders without crashing", async () => {
    render(<App />);
    // Check if the main heading is present
    const heading = await screen.findByText("Search Library Catalog");
    expect(heading).toBeInTheDocument();
  });
});
