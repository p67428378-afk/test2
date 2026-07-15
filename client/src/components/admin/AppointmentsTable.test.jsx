import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import AppointmentsTable from "./components/admin/AppointmentsTable";

describe("AppointmentsTable Smoke Test", () => {
  it("renders empty state when no appointments", () => {
    render(
      <AppointmentsTable
        appointments={[]}
        onApprove={() => {}}
        onDeny={() => {}}
      />,
    );
    expect(
      screen.getByText(/No pending appointments found/i),
    ).toBeInTheDocument();
  });
});
