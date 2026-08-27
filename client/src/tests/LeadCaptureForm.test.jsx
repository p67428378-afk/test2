import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LeadCaptureForm from "../components/leads/LeadCaptureForm.jsx";
import * as api from "../services/api.js";

vi.mock("../services/api.js", () => ({
  getProjects: vi.fn(),
  getProjectById: vi.fn(),
  createLead: vi.fn(),
  getLeads: vi.fn(),
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("LeadCaptureForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form inputs and submit button", () => {
    render(<LeadCaptureForm />);

    expect(screen.getByLabelText(/Your Name \/ Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Estimated Budget Range/i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Project Description & Requirements/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Project Inquiry/i }),
    ).toBeInTheDocument();
  });

  it("shows client-side validation errors when submitting empty form", async () => {
    render(<LeadCaptureForm />);

    fireEvent.click(
      screen.getByRole("button", { name: /Send Project Inquiry/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/Client name is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Email address is required/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Project message details are required/i),
      ).toBeInTheDocument();
    });

    expect(api.createLead).not.toHaveBeenCalled();
  });

  it("submits valid lead data successfully and displays confirmation", async () => {
    const mockCreatedLead = {
      id: "lead-uuid-12345",
      client_name: "John Doe",
      email: "john@example.com",
      budget_range: "$1,000 - $5,000",
      message: "Looking for a custom web application.",
      status: "new",
      created_at: "2026-08-27T14:30:00Z",
    };

    vi.mocked(api.createLead).mockResolvedValue(mockCreatedLead);

    render(<LeadCaptureForm />);

    fireEvent.change(screen.getByLabelText(/Your Name \/ Company/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Estimated Budget Range/i), {
      target: { value: "$1,000 - $5,000" },
    });
    fireEvent.change(
      screen.getByLabelText(/Project Description & Requirements/i),
      {
        target: { value: "Looking for a custom web application." },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Send Project Inquiry/i }),
    );

    await waitFor(() => {
      expect(api.createLead).toHaveBeenCalledWith({
        client_name: "John Doe",
        email: "john@example.com",
        budget_range: "$1,000 - $5,000",
        message: "Looking for a custom web application.",
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("lead-success-message")).toBeInTheDocument();
      expect(
        screen.getByText(/Inquiry submitted successfully!/i),
      ).toBeInTheDocument();
    });
  });

  it("handles server submission error gracefully without fake success", async () => {
    vi.mocked(api.createLead).mockRejectedValue({
      response: {
        data: {
          detail: "Database connection failed while storing lead",
        },
      },
    });

    render(<LeadCaptureForm />);

    fireEvent.change(screen.getByLabelText(/Your Name \/ Company/i), {
      target: { value: "Acme Corp" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "contact@acme.com" },
    });
    fireEvent.change(
      screen.getByLabelText(/Project Description & Requirements/i),
      {
        target: { value: "Urgent migration inquiry." },
      },
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Send Project Inquiry/i }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("lead-error-message")).toBeInTheDocument();
      expect(
        screen.getByText(/Database connection failed/i),
      ).toBeInTheDocument();
    });

    // Success alert must NOT be displayed
    expect(
      screen.queryByTestId("lead-success-message"),
    ).not.toBeInTheDocument();
  });
});
