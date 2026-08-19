import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import AppointmentsPage from "./AppointmentsPage";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../services/api", () => ({
  appointmentsApi: {
    getAppointments: vi
      .fn()
      .mockResolvedValue([
        {
          id: "app1",
          pet_id: "1",
          appointment_date: "2026-06-01T10:00:00Z",
          reason: "Routine Checkup",
          status: "SCHEDULED",
        },
      ]),
    createAppointment: vi.fn().mockResolvedValue({ id: "app2" }),
    updateAppointmentStatus: vi
      .fn()
      .mockResolvedValue({ id: "app1", status: "COMPLETED" }),
  },
  petsApi: {
    getPets: vi
      .fn()
      .mockResolvedValue([{ id: "1", name: "Buddy", species: "dog" }]),
  },
}));

describe("AppointmentsPage Component", () => {
  it("renders appointments page title and roster", async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <AppointmentsPage />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Appointment Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointments Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Book Appointment/i)).toBeInTheDocument();
  });
});
