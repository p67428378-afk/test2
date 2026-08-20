import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "./components/common/Badge";
import StatCard from "./components/common/StatCard";
import Stepper from "./components/common/Stepper";

describe("Badge Component", () => {
  it("renders Active status correctly", () => {
    render(<Badge status="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders Expired status correctly", () => {
    render(<Badge status="Expired" />);
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });
});

describe("StatCard Component", () => {
  it("renders title and value correctly", () => {
    render(<StatCard title="Total Products" value={12} />);
    expect(screen.getByText("Total Products")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});

describe("Stepper Component", () => {
  it("renders all steps", () => {
    render(<Stepper currentStep={1} />);
    expect(screen.getByText("Product Info")).toBeInTheDocument();
    expect(screen.getByText("Warranty Details")).toBeInTheDocument();
    expect(screen.getByText("Upload Receipt")).toBeInTheDocument();
  });
});
