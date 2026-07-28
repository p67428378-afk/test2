import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import CaseDetailPage from "../pages/CaseDetailPage.jsx";

// Mock useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }),
  };
});

// Mock services
vi.mock("../services/api", () => ({
  caseService: {
    getCaseEvidence: vi.fn(() => Promise.resolve([])),
  },
  evidenceService: {
    getEvidence: vi.fn(() => Promise.resolve({})),
  },
}));

describe("CaseDetailPage Component", () => {
  const mockCases = [
    {
      id: "1",
      case_number: "CASE-2026-0001",
      description: "Test Case 1",
      evidence_count: 1,
      created_at: "2026-01-01T00:00:00Z",
    },
  ];
  const mockEvidence = [];

  it("renders without crashing", async () => {
    render(
      <Router>
        <CaseDetailPage
          cases={mockCases}
          evidenceList={mockEvidence}
          fetchData={vi.fn()}
        />
      </Router>,
    );
    expect(await screen.findByText(/Back to Dashboard/i)).toBeInTheDocument();
  });
});
