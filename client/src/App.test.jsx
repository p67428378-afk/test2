import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

describe("DG Cluster Assortment Advisor App", () => {
  it("renders the header title correctly", () => {
    render(<App />);
    expect(screen.getByText(/Cluster Assortment Advisor/i)).toBeInTheDocument();
  });

  it("renders KPI cards", () => {
    render(<App />);
    expect(screen.getByText(/Sales per Linear Ft/i)).toBeInTheDocument();
    expect(screen.getByText(/Private Brand Mix/i)).toBeInTheDocument();
    expect(screen.getByText(/In-Stock Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Shelf Capacity Util/i)).toBeInTheDocument();
  });

  it("renders scenario selector with Balanced pre-selected", () => {
    render(<App />);
    expect(
      screen.getByText(/Assortment Recommendation Scenarios/i),
    ).toBeInTheDocument();
    const balancedHeadings = screen.getAllByText(/Balanced/i);
    expect(balancedHeadings.length).toBeGreaterThan(0);
  });

  it("renders SKU performance table and search filter", () => {
    render(<App />);
    expect(
      screen.getByText(/Snacks Category SKU Performance/i),
    ).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText(/Search SKU or Product/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("filters SKUs when typing in search input", async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search SKU or Product/i);
    fireEvent.change(searchInput, { target: { value: "Peanuts" } });
    expect(
      screen.getByText(/Clover Valley Roasted Peanuts/i),
    ).toBeInTheDocument();
  });

  it("renders submit button in approval panel", () => {
    render(<App />);
    const submitBtn = screen.getByText(/Submit & Lock Assortment/i);
    expect(submitBtn).toBeInTheDocument();
  });
});
