import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import App from "../App";

describe("Hospital Management System App Smoke Tests", () => {
  it("renders the header and main navigation sidebar without crashing", () => {
    render(<App />);

    // Assert main portal titles and navigation items exist
    expect(screen.getByText(/ApexCare HMS/i)).toBeInTheDocument();
    expect(screen.getByText(/Hospital Management Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Patients/i)).toBeInTheDocument();
    expect(screen.getByText(/Appointments/i)).toBeInTheDocument();
    expect(screen.getByText(/EMR Records/i)).toBeInTheDocument();
    expect(screen.getByText(/Billing & Invoices/i)).toBeInTheDocument();
  });
});
