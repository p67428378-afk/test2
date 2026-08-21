import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Layers } from "lucide-react";
import StatCard from "./StatCard";

describe("StatCard Component", () => {
  it("renders title and value", () => {
    render(<StatCard title="Total Decks" value={5} icon={Layers} />);
    expect(screen.getByText("Total Decks")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
