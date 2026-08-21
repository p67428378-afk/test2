import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatCard from "./StatCard";
import { Users } from "lucide-react";

describe("StatCard Component", () => {
  it("renders title and value", () => {
    render(<StatCard title="Total Patients" value="120" icon={Users} />);
    expect(screen.getByText("Total Patients")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });
});
