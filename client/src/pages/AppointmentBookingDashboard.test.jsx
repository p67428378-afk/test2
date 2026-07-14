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
      status: "confirmed",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.getDoctors.mockResolvedValue(mockDoctors);
    api.getDoctorAvailability.mockResolvedValue(mockAvailability);
    api.getPatientAppointments.mockResolvedValue(mockAppointments);
  });

  it("renders the dashboard with doctors and appointments", async () => {
    render(<AppointmentBookingDashboard />);

    // Wait for doctors to load
    await waitFor(() => {
      expect(screen.getByText("Dr. Alice Smith")).toBeInTheDocument();
    });

    // Check if upcoming appointments are rendered
    expect(screen.getByText("Dr. Robert Chen")).toBeInTheDocument();
    expect(screen.getByText("Pediatrics")).toBeInTheDocument();
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
});
