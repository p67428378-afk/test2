import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import VisitorRegistrationForm from "../components/VisitorRegistrationForm";
import AppointmentScheduler from "../components/AppointmentScheduler";
import DigitalPassView from "../components/DigitalPassView";
import WatchlistManagementModal from "../components/WatchlistManagementModal";
import GateControlTerminal from "../components/GateControlTerminal";
import AppointmentApprovalsTable from "../components/AppointmentApprovalsTable";
import IdentityVerificationTable from "../components/IdentityVerificationTable";
import VisitorHistoryTable from "../components/VisitorHistoryTable";

// Mock API service module
vi.mock("../services/api", () => ({
  registerVisitor: vi
    .fn()
    .mockResolvedValue({
      id: "v123",
      full_name: "Jane Doe",
      verification_status: "PENDING",
      is_watchlist_flagged: false,
    }),
  screenVisitorWatchlist: vi
    .fn()
    .mockResolvedValue({
      is_flagged: false,
      national_id: "ID-123",
      message: "National ID clear",
    }),
  listVisitors: vi
    .fn()
    .mockResolvedValue([
      {
        id: "v123",
        full_name: "Jane Doe",
        national_id: "ID-123",
        email: "jane@example.com",
        verification_status: "PENDING",
        visitor_type: "STANDARD",
        is_watchlist_flagged: false,
      },
    ]),
  listInmates: vi
    .fn()
    .mockResolvedValue([
      {
        id: "i456",
        full_name: "John Smith",
        inmate_number: "INV-404",
        cell_location: "Block A-101",
      },
    ]),
  createAppointment: vi
    .fn()
    .mockResolvedValue({
      id: "apt789",
      visitor_id: "v123",
      inmate_id: "i456",
      visit_date: "2026-06-01",
      start_time: "10:00 AM",
    }),
  listAppointments: vi
    .fn()
    .mockResolvedValue([
      {
        id: "apt789",
        visitor_id: "v123",
        inmate_id: "i456",
        visit_date: "2026-06-01",
        start_time: "10:00 AM",
        status: "PENDING",
        visitor: { full_name: "Jane Doe", national_id: "ID-123" },
        inmate: {
          full_name: "John Smith",
          inmate_number: "INV-404",
          cell_location: "A-1",
        },
      },
    ]),
  updateAppointmentStatus: vi
    .fn()
    .mockResolvedValue({ id: "apt789", status: "APPROVED" }),
  generateDigitalPass: vi
    .fn()
    .mockResolvedValue({
      id: "pass123",
      pass_token: "PASS-8892-HMAC256-TOKEN",
      expires_at: "2026-06-01T12:00:00Z",
    }),
  downloadDigitalPassPdf: vi
    .fn()
    .mockResolvedValue({ pdf_url: "https://example.com/pass.pdf" }),
  scanQRPass: vi
    .fn()
    .mockResolvedValue({
      status: "APPROVED",
      message: "Clearance Granted",
      check_in_timestamp: "2026-06-01T10:00:00Z",
      visitor_name: "Jane Doe",
      inmate_name: "John Smith",
      duration_minutes: 60,
      security_status: "CLEARED",
    }),
  listEntryExitLogs: vi.fn().mockResolvedValue([]),
  checkInVisitor: vi
    .fn()
    .mockResolvedValue({ id: "log123", check_in_time: "2026-06-01T10:00:00Z" }),
  checkOutVisitor: vi
    .fn()
    .mockResolvedValue({
      id: "log123",
      check_out_time: "2026-06-01T10:30:00Z",
    }),
  listWatchlist: vi
    .fn()
    .mockResolvedValue([
      {
        id: "w1",
        national_id: "ID-BANNED",
        full_name: "Robert Vance",
        reason: "Contraband",
        severity_level: "HIGH",
        is_active: true,
      },
    ]),
  addToWatchlist: vi
    .fn()
    .mockResolvedValue({ id: "w2", national_id: "ID-NEW" }),
  removeFromWatchlist: vi.fn().mockResolvedValue({}),
  createVerification: vi.fn().mockResolvedValue({ id: "ver1" }),
}));

describe("Prison Visitor Management UI Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders VisitorRegistrationForm correctly", async () => {
    render(<VisitorRegistrationForm />);
    expect(
      screen.getByText(/Online Visitor Registration/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Legal Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/National ID/i)).toBeInTheDocument();
  });

  it("renders AppointmentScheduler correctly", async () => {
    render(<AppointmentScheduler />);
    expect(
      screen.getByText(/Schedule Visit & Pass Request/i),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText(/Choose Registered Visitor/i),
      ).toBeInTheDocument();
    });
  });

  it("renders DigitalPassView correctly", async () => {
    const mockAppt = {
      id: "apt789",
      visitor: { full_name: "Jane Doe" },
      inmate: { full_name: "John Smith" },
      visit_date: "2026-06-01",
    };
    const mockPass = {
      id: "pass123",
      pass_token: "PASS-8892-HMAC256-TOKEN",
      expires_at: "2026-06-01T12:00:00Z",
    };
    render(<DigitalPassView appointment={mockAppt} passData={mockPass} />);
    expect(screen.getByText(/Active Digital Gate Pass/i)).toBeInTheDocument();
    expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();
  });

  it("renders GateControlTerminal correctly", () => {
    render(<GateControlTerminal />);
    expect(
      screen.getByText(/Gate 1 — Express QR Check-In Terminal/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Simulate Express QR Scan/i)).toBeInTheDocument();
  });

  it("renders WatchlistManagementModal when open", () => {
    render(<WatchlistManagementModal isOpen={true} onClose={() => {}} />);
    expect(
      screen.getByText(/Automated Security Watchlist Management/i),
    ).toBeInTheDocument();
  });

  it("renders AppointmentApprovalsTable correctly", async () => {
    render(<AppointmentApprovalsTable />);
    expect(
      screen.getByText(/Appointment Approval Requests/i),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });
  });

  it("renders IdentityVerificationTable correctly", async () => {
    render(<IdentityVerificationTable />);
    expect(
      screen.getByText(/Identity Verification Queue/i),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });
  });

  it("renders VisitorHistoryTable correctly", async () => {
    render(<VisitorHistoryTable />);
    expect(
      screen.getByText(/Visitor History & Immutable Audit Log/i),
    ).toBeInTheDocument();
  });
});
