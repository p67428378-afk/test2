import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatCard from "./StatCard.jsx";

describe("StatCard", () => {
  it("renders title, value, and badge", () => {
    render(
      <StatCard
        title="Total Spend"
        value="$1,250.00"
        badgeText="+12.5%"
        badgeVariant="success"
      />,
    );

    expect(screen.getByText(/Total Spend/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1,250\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/\+12\.5%/i)).toBeInTheDocument();
  });
});
