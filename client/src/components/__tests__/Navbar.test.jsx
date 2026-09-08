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
    expect(screen.getByText(/Rooms Inventory/i)).toBeInTheDocument();
    expect(screen.getByText(/Reservations/i)).toBeInTheDocument();
    expect(screen.getByText(/Front Desk/i)).toBeInTheDocument();
    expect(screen.getByText(/Billing & Folios/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
  });
});
