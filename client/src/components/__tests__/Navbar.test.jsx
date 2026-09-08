import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "../Navbar.jsx";

describe("Navbar Component", () => {
  it("renders navigation brand and links", () => {
    render(
      <BrowserRouter>
        <Navbar
          currentUser={{ full_name: "Jane Doe", email: "jane@example.com" }}
          onLogout={vi.fn()}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Grand Horizon/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Rooms Inventory/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Reservations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Front Desk/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Billing & Folios/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
  });
});
