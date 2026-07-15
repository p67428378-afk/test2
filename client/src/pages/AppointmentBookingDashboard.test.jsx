import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import AppointmentBookingDashboard from "./AppointmentBookingDashboard";
import * as api from "../services/api";

// Mock the API service
vi.mock("../services/api", () => ({
  getDoctors: vi.fn(),
  getDoctorAvailability: vi.fn(),
  createAppointment: vi.fn(),
  getPatientAppointments: vi.fn(),
  cancelAppointment: vi.fn(),
  rescheduleAppointment: vi.fn(),
  verifyInsurance: vi.fn(),
}));

describe("AppointmentBookingDashboard", () => {
  const mockDoctors = [
    { id: "doc-1", name: "Dr. Alice Smith", specialty: "Cardiology" },
    { id: "doc-2", name: "Dr. Robert Chen", specialty: "Pediatrics" },
  ];

  const mockAvailability = {
    doctorId: "doc-1",
    slots: ["2026-07-15T10:30:00", "2026-07-15T14:00:00"],
  };

  const mockAppointments = [
    {
      id: "appt-1",
      doctorName: "Dr. Robert Chen",
      start_time: "2026-07-18T14:00:00",
      end_time: "2026-07-18T14:30:00",
      status: "booked",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getDoctors.mockResolvedValue(mockDoctors);
    api.getDoctorAvailability.mockResolvedValue(mockAvailability);
    api.getPatientAppointments.mockResolvedValue(mockAppointments);
    api.verifyInsurance.mockResolvedValue({
      estimated_copay: 25.0,
      message: "Insurance Verified Successfully via Clearinghouse API",
    });
  });

  it("renders the dashboard with doctors and appointments", async () => {
    render(<AppointmentBookingDashboard />);

    // Wait for doctors to load
    await waitFor(() => {
      expect(screen.getByText("Dr. Alice Smith")).toBeInTheDocument();
    });

    // Check if upcoming appointments are rendered
    expect(screen.getByText("Dr. Robert Chen")).toBeInTheDocument();
  });

  it("allows switching roles and entering custom patient ID", async () => {
    render(<AppointmentBookingDashboard />);

    const coordinatorBtn = screen.getByText("Front-Desk Coordinator");
    fireEvent.click(coordinatorBtn);

    // Should show Patient UUID input
    const input = screen.getByPlaceholderText("Enter Patient UUID");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "custom-patient-123" } });
    expect(input.value).toBe("custom-patient-123");
  });

  it("allows verifying insurance and displays estimated co-pay", async () => {
    render(<AppointmentBookingDashboard />);

    // Wait for doctors to load
    await waitFor(() => {
      expect(screen.getByText("Dr. Alice Smith")).toBeInTheDocument();
    });

    // Fill in insurance details
    const providerSelect = screen.getByLabelText("Insurance Provider");
    const policyInput = screen.getByPlaceholderText("Enter Policy ID");
    const verifyBtn = screen.getByText("Verify Insurance");

    fireEvent.change(providerSelect, { target: { value: "Aetna" } });
    fireEvent.change(policyInput, { target: { value: "AETNA-12345" } });
    fireEvent.click(verifyBtn);

    await waitFor(() => {
      expect(api.verifyInsurance).toHaveBeenCalledWith({
        patient_id: "00000000-0000-0000-0000-000000000001",
        insurance_provider: "Aetna",
        policy_id: "AETNA-12345",
      });
    });

    // Check if co-pay is displayed
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    expect(
      screen.getByText("Insurance Verified Successfully via Clearinghouse API"),
    ).toBeInTheDocument();
  });

  it("allows initiating rescheduling and displays side-by-side comparison", async () => {
    render(<AppointmentBookingDashboard />);

    // Wait for appointments to load
    await waitFor(() => {
      expect(screen.getByText("Dr. Robert Chen")).toBeInTheDocument();
    });

    // Click Reschedule button
    const rescheduleBtn = screen.getByText("Reschedule");
    fireEvent.click(rescheduleBtn);

    // Should show side-by-side comparison headers
    expect(screen.getByText("Current Slot")).toBeInTheDocument();
    expect(screen.getByText("New Slot")).toBeInTheDocument();
  });
});
