import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CodebaseReportDashboard from "../components/CodebaseReportDashboard";
import * as api from "../services/api";

const mockReport = {
  issue_key: "SCRUM-231",
  repo_url: "https://github.com/p67428378-afk/test2",
  branch_analyzed: "staging/ISSUE-SCRUM-231",
  analyzed_at: "2026-05-18T12:00:00Z",
  status: "completed",
  tech_stack: {
    backend: "Python 3.11 / FastAPI",
    frontend: "React 18 / Vite / Tailwind CSS",
  },
  metrics: {
    test_pass_rate: "100%",
    total_tests: 21,
    high_centrality_files: ["server/main.py", "client/src/App.jsx"],
  },
};

describe("CodebaseReportDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays codebase report metrics", async () => {
    vi.spyOn(api, "getCodebaseReport").mockResolvedValueOnce(mockReport);

    render(<CodebaseReportDashboard issueKey="SCRUM-231" />);

    expect(
      screen.getByText(/Loading codebase analysis report.../i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Codebase Analysis Report")).toBeInTheDocument();
      expect(screen.getByText("100%")).toBeInTheDocument();
      expect(screen.getByText("21 / 21 tests passing")).toBeInTheDocument();
      expect(screen.getByText("server/main.py")).toBeInTheDocument();
      expect(screen.getByText("client/src/App.jsx")).toBeInTheDocument();
    });
  });

  it("triggers new analysis scan on button click", async () => {
    vi.spyOn(api, "getCodebaseReport").mockResolvedValue(mockReport);
    vi.spyOn(api, "triggerCodebaseAnalysis").mockResolvedValueOnce({
      id: "run-123",
      issue_key: "SCRUM-231",
      repo_url: "https://github.com/p67428378-afk/test2",
      branch_name: "staging/ISSUE-SCRUM-231",
      status: "completed",
      triggered_at: "2026-05-18T12:05:00Z",
    });

    render(<CodebaseReportDashboard issueKey="SCRUM-231" />);

    await waitFor(() => {
      expect(screen.getByText("Codebase Analysis Report")).toBeInTheDocument();
    });

    const scanBtn = screen.getByRole("button", { name: /Run Analysis Scan/i });
    fireEvent.click(scanBtn);

    await waitFor(() => {
      expect(api.triggerCodebaseAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({
          issue_key: "SCRUM-231",
        }),
      );
    });
  });

  it("displays error fallback when report fetch fails", async () => {
    vi.spyOn(api, "getCodebaseReport").mockRejectedValueOnce(
      new Error("Network Error"),
    );

    render(<CodebaseReportDashboard issueKey="SCRUM-231" />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(
        /Codebase analysis report pending or unavailable/i,
      );
    });
  });
});
