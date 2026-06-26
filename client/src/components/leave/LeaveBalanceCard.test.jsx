import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LeaveBalanceCard from "./LeaveBalanceCard";

describe("LeaveBalanceCard", () => {
  it("renders leave balance card correctly", () => {
    render(
      <LeaveBalanceCard
        title="Vacation"
        balance={15}
        maxBalance={20}
        icon="beach_access"
        colorClass="bg-surface-container text-primary"
        progressColor="bg-primary-container"
      />,
    );

    expect(screen.getByText("Vacation")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("/20")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });
});
