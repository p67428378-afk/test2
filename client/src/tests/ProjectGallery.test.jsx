import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProjectGallery from "../components/portfolio/ProjectGallery.jsx";
import * as api from "../services/api.js";

vi.mock("../services/api.js", () => ({
  getProjects: vi.fn(),
  getProjectById: vi.fn(),
  createLead: vi.fn(),
  getLeads: vi.fn(),
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("ProjectGallery Component", () => {
  const mockProjects = [
    {
      id: "proj-1234-uuid",
      title: "E-Commerce Platform",
      summary: "High-volume online retail platform with automated checkout.",
      thumbnail_url: "https://example.com/thumb1.png",
      tags: ["React", "FastAPI"],
      live_demo_url: "https://demo.example.com",
      github_url: "https://github.com/example/ecommerce",
      created_at: "2026-01-15T10:00:00Z",
    },
    {
      id: "proj-5678-uuid",
      title: "Analytics Dashboard",
      summary: "Real-time metrics visualization platform.",
      thumbnail_url: null,
      tags: ["TypeScript", "Tailwind"],
      live_demo_url: null,
      github_url: "https://github.com/example/analytics",
      created_at: "2026-02-01T12:00:00Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially and then displays project list", async () => {
    vi.mocked(api.getProjects).mockResolvedValue(mockProjects);

    render(
      <MemoryRouter>
        <ProjectGallery />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /Showcase Projects/i }),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("E-Commerce Platform")).toBeInTheDocument();
      expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
    });

    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getAllByText("FastAPI").length).toBeGreaterThan(0);
  });

  it("renders fallback placeholder for projects without thumbnail", async () => {
    vi.mocked(api.getProjects).mockResolvedValue(mockProjects);

    render(
      <MemoryRouter>
        <ProjectGallery />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
    });

    const placeholder = screen.getByTestId("project-thumbnail-placeholder");
    expect(placeholder).toBeInTheDocument();
  });

  it("renders error state when api fails", async () => {
    vi.mocked(api.getProjects).mockRejectedValue(
      new Error("Network connection error"),
    );

    render(
      <MemoryRouter>
        <ProjectGallery />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to Load Projects/i)).toBeInTheDocument();
    });
  });
});
