import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom";
import EvidenceDetailPage from "../pages/EvidenceDetailPage.jsx";

// Mock useParams
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "e1" }),
  };
});

// Mock services
vi.mock("../services/api", () => ({
  evidenceService: {
    getEvidence: vi.fn(() =>
      Promise.resolve({
        id: "e1",
        filename: "evidence1.jpg",
        file_type: "image/jpeg",
        file_size: 1024,
        sha256_hash: "hash123",
        storage_path: "evidence/e1/evidence1.jpg",
        uploaded_by_id: "u1",
        case_id: "1",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      }),
    ),
  },
  auditService: {
    getChainOfCustody: vi.fn(() =>
      Promise.resolve([
        {
          id: "c1",
          evidence_id: "e1",
          user_id: "u1",
          username: "testuser",
          action: "UPLOAD",
          details: {},
          timestamp: "2026-01-01T00:00:00Z",
        },
      ]),
    ),
  },
}));

describe("EvidenceDetailPage Component", () => {
  const mockCases = [
    {
      id: "1",
      case_number: "CASE-2026-0001",
      description: "Test Case 1",
      evidence_count: 1,
      created_at: "2026-01-01T00:00:00Z",
    },
  ];

  it("renders evidence details and chain of custody timeline", async () => {
    render(
      <Router>
        <EvidenceDetailPage cases={mockCases} fetchData={vi.fn()} />
      </Router>,
    );

    expect(await screen.findByText("evidence1.jpg")).toBeInTheDocument();
    expect(screen.getByText("image/jpeg")).toBeInTheDocument();
    expect(screen.getByText("UPLOAD")).toBeInTheDocument();
  });
});
