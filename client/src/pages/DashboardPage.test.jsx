import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import DashboardPage from "./DashboardPage";
import { AuthProvider } from "../context/AuthContext";

vi.mock("../services/api", () => ({
  petsApi: {
    getPets: vi
      .fn()
      .mockResolvedValue([
        {
          id: "1",
          name: "Buddy",
          species: "dog",
          breed: "Golden Retriever",
          age: 3,
          weight: 25.0,
        },
      ]),
    createPet: vi.fn().mockResolvedValue({ id: "2", name: "Milo" }),
  },
  appointmentsApi: {
    getAppointments: vi.fn().mockResolvedValue([]),
  },
  remindersApi: {
    getReminders: vi.fn().mockResolvedValue([]),
  },
}));

describe("DashboardPage Component", () => {
  it("renders dashboard heading and metric cards", async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(
      screen.getByText(/Clinic Overview & Pet Registry/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Total Registered Pets/i)).toBeInTheDocument();
    expect(screen.getByText(/Scheduled Visits/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Reminders/i)).toBeInTheDocument();
  });
});
