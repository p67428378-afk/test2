import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import VisitorRegistrationForm from "../components/VisitorRegistrationForm";
import AppointmentScheduler from "../components/AppointmentScheduler";
import IdentityVerificationTable from "../components/IdentityVerificationTable";
import AppointmentApprovalsTable from "../components/AppointmentApprovalsTable";
import GateControlDashboard from "../components/GateControlDashboard";
import VisitorHistoryTable from "../components/VisitorHistoryTable";

// Mock API service methods
vi.mock("../services/api", () => ({
  registerVisitor: vi
    .fn()
    .mockResolvedValue({ id: "visitor-123", verification_status: "PENDING" }),
  listVisitors: vi.fn().mockResolvedValue([
    {
      id: "v-1",
      full_name: "Jane Doe",
      national_id: "ID-98765432",
      email: "jane@example.com",
      verification_status: "PENDING",
      photo_id_url: "https://example.com/id.png",
    },
  ]),
  listInmates: vi.fn().mockResolvedValue([
    {
      id: "i-1",
      full_name: "John Smith",
      inmate_number: "IN-456",
      cell_location: "Block-A",
      status: "ACTIVE",
    },
  ]),
  listAppointments: vi.fn().mockResolvedValue([
    {
      id: "apt-1",
      visitor_id: "v-1",
      inmate_id: "i-1",
      visit_date: "2026-06-01",
      start_time: "10:00 AM",
      relationship: "Family",
      status: "APPROVED",
      visitor: { full_name: "Jane Doe", national_id: "ID-98765432" },
      inmate: {
        full_name: "John Smith",
        inmate_number: "IN-456",
        cell_location: "Block-A",
      },
    },
  ]),
  listEntryExitLogs: vi.fn().mockResolvedValue([]),
  createAppointment: vi.fn().mockResolvedValue({ id: "apt-2" }),
  createVerification: vi.fn().mockResolvedValue({ id: "ver-1" }),
  updateAppointmentStatus: vi
    .fn()
    .mockResolvedValue({ id: "apt-1", status: "APPROVED" }),
  checkInVisitor: vi
    .fn()
    .mockResolvedValue({ id: "log-1", check_in_time: "2026-06-01T10:00:00Z" }),
  checkOutVisitor: vi
    .fn()
    .mockResolvedValue({ id: "log-1", check_out_time: "2026-06-01T10:30:00Z" }),
}));

describe("Prison Visitor Management System Components", () => {
  it("renders VisitorRegistrationForm correctly", () => {
    render(<VisitorRegistrationForm />);
    expect(
      screen.getByText(/Online Visitor Registration/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Legal Name/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/National ID \/ Passport No\./i),
    ).toBeInTheDocument();
  });

  it("renders AppointmentScheduler correctly", async () => {
    render(<AppointmentScheduler />);
    expect(screen.getByText(/Schedule Visit Appointment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Visit Date/i)).toBeInTheDocument();
  });

  it("renders IdentityVerificationTable queue", async () => {
    render(<IdentityVerificationTable />);
    expect(
      screen.getByText(/Identity Verification Queue/i),
    ).toBeInTheDocument();
  });

  it("renders AppointmentApprovalsTable queue", async () => {
    render(<AppointmentApprovalsTable />);
    expect(
      screen.getByText(/Visit Appointment Approval Queue/i),
    ).toBeInTheDocument();
  });

  it("renders GateControlDashboard", async () => {
    render(<GateControlDashboard />);
    expect(screen.getByText(/Security Gate Control/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Scan Barcode \/ Search Visitor Name/i),
    ).toBeInTheDocument();
  });

  it("renders VisitorHistoryTable", async () => {
    render(<VisitorHistoryTable />);
    expect(
      screen.getByText(/Visitor History & Immutable Audit Log/i),
    ).toBeInTheDocument();
  });
});
