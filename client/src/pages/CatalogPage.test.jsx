import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import CatalogPage from "./CatalogPage";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../services/api", () => ({
  toursAPI: {
    listTours: vi.fn().mockResolvedValue([
      {
        id: "t-1",
        name: "Renaissance Art Tour",
        description: "Explore masterworks.",
        duration_minutes: 60,
      },
    ]),
  },
  schedulesAPI: {
    listSchedules: vi.fn().mockResolvedValue([]),
  },
  authAPI: {
    login: vi.fn(),
  },
}));

describe("CatalogPage Component", () => {
  it("renders hero title and search input", async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <CatalogPage />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(
      screen.getByText(/Discover & Book Guided Museum Tours/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search tours by title or description/i),
    ).toBeInTheDocument();
  });
});
