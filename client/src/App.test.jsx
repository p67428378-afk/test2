import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App.jsx";

// Mock axios / assortmentService if necessary or test App component directly
describe("DG Cluster Assortment Advisor App", () => {
  it("renders the dashboard header and title", async () => {
    render(<App />);
    expect(screen.getByText(/Cluster Assortment Advisor/i)).toBeInTheDocument();
    expect(screen.getByText(/Small Town Value Cluster/i)).toBeInTheDocument();
  });

  it("renders KPI cards with default metric labels", async () => {
    render(<App />);
    expect(screen.getByText(/Sales per Linear Ft/i)).toBeInTheDocument();
    expect(screen.getByText(/Private Brand Mix/i)).toBeInTheDocument();
    expect(screen.getByText(/In-Stock Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Shelf Capacity Util/i)).toBeInTheDocument();
  });

  it("renders Scenario cards with Balanced pre-selected", async () => {
    render(<App />);
    expect(screen.getAllByText(/Balanced/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Aggressive/i)).toBeInTheDocument();
    expect(screen.getByText(/Conservative/i)).toBeInTheDocument();
  });

  it("updates Approval Review panel when selecting another scenario card", async () => {
    render(<App />);
    const aggressiveCard = screen.getByText(/Aggressive/i);
    fireEvent.click(aggressiveCard);

    // Active scenario in Approval Review should update
    await waitFor(() => {
      expect(screen.getAllByText(/Aggressive/i).length).toBeGreaterThan(1);
    });
  });

  it("renders SKU Performance table and filter input", async () => {
    render(<App />);
    expect(
      screen.getByText(/Snacks Category SKU Performance/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Filter SKUs.../i)).toBeInTheDocument();
  });

  it("submits scenario and displays confirmation banner", async () => {
    render(<App />);
    const submitButton = screen.getByRole("button", {
      name: /Submit & Lock Assortment/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Assortment Recommendation Submitted & Locked!/i),
      ).toBeInTheDocument();
    });
  });
});
