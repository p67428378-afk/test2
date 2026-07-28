import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage.jsx";

// Mock the services
vi.mock("../services/api", () => ({
  authService: {
    getCurrentUser: vi.fn(() => ({
      username: "test@example.com",
      role: "Investigator",
    })),
  },
  auditService: {
    getAuditLogs: vi.fn(() => Promise.resolve([])),
  },
}));

describe("DashboardPage Component", () => {
  const mockCases = [
    {
      id: "1",
      case_number: "CASE-2026-0001",
      description: "Test Case 1",
      evidence_count: 2,
      created_at: "2026-01-01T00:00:00Z",
    },
  ];
  const mockEvidence = [
    {
      id: "1",
      filename: "file1.jpg",
      file_type: "image/jpeg",
      file_size: 100,
      sha256_hash: "hash1",
      case_id: "1",
      created_at: "2026-01-01T00:00:00Z",
    },
  ];
  const mockFetchData = vi.fn();

  it("renders dashboard stats and cases", async () => {
    render(
      <Router>
        <DashboardPage
          showNewCaseModal={false}
          setShowNewCaseModal={vi.fn()}
          showUploadModal={false}
          setShowUploadModal={vi.fn()}
          cases={mockCases}
          setCases={vi.fn()}
          evidenceList={mockEvidence}
          setEvidenceList={vi.fn()}
          fetchData={mockFetchData}
        />
      </Router>,
    );

    // Wait for loading to finish (since loading is initially true and then set to false in useEffect)
    // But wait, in our component, loading is set to false after fetchData resolves.
    // Let's check if the loading spinner is shown or if we can assert on the rendered content.
    // Since we mock fetchData, it will resolve immediately.
    expect(await screen.findByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("CASE-2026-0001")).toBeInTheDocument();
  });
});
