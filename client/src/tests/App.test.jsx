import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "../App.jsx";

// Mock the services
vi.mock("../services/api", () => ({
  authService: {
    isAuthenticated: vi.fn(() => false),
    getCurrentUser: vi.fn(() => null),
    login: vi.fn(),
    register: vi.fn(),
  },
  caseService: {
    getCases: vi.fn(() => Promise.resolve([])),
    getCaseEvidence: vi.fn(() => Promise.resolve([])),
  },
  evidenceService: {
    getEvidence: vi.fn(() => Promise.resolve({})),
  },
  auditService: {
    getAuditLogs: vi.fn(() => Promise.resolve([])),
  },
  default: {},
}));

describe("App Component", () => {
  it("renders login page when not authenticated", () => {
    render(<App />);
    expect(screen.getByText("DEMS Portal")).toBeInTheDocument();
    expect(
      screen.getByText("Digital Evidence Management System"),
    ).toBeInTheDocument();
  });
});
