import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock child pages to keep App integration test lightweight and reliable
vi.mock("./services/api.js", () => ({
  authApi: { login: vi.fn(), getMe: vi.fn() },
  roomsApi: { getRooms: vi.fn().mockResolvedValue([]) },
  reservationsApi: { getReservations: vi.fn().mockResolvedValue([]) },
  frontDeskApi: { checkIn: vi.fn(), checkOut: vi.fn() },
  invoicesApi: {
    getInvoices: vi.fn().mockResolvedValue([]),
    getInvoiceByReservation: vi.fn(),
  },
}));

describe("App Component", () => {
  it("renders header, navigation and test credential notice", () => {
    render(<App />);
    expect(screen.getByText(/Grand Horizon/i)).toBeInTheDocument();
    expect(screen.getByText(/Test account:/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
