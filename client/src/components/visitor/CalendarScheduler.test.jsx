import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import CalendarScheduler from "./components/visitor/CalendarScheduler";

describe("CalendarScheduler Smoke Test", () => {
  it("renders scheduler elements", () => {
    render(<CalendarScheduler onSubmitRequest={() => {}} />);
    expect(screen.getByText(/Schedule a Visit/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Inmate/i)).toBeInTheDocument();
  });
});
