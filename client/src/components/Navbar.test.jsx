import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Navbar from "./layout/Navbar";
import { AuthProvider } from "../context/AuthContext";

describe("Navbar Component", () => {
  it("renders branding and main navigation links", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(screen.getByText(/Pet Clinic/i)).toBeInTheDocument();
    expect(screen.getByText(/Pets & Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/Vaccinations & Reminders/i)).toBeInTheDocument();
  });
});
