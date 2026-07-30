import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AnimalCard from "./AnimalCard";

const mockAnimal = {
  id: "1",
  name: "Simba",
  species: "Lion",
  status: "Active",
  enclosure_id: "e1",
  habitat: "Savannah grasslands",
  conservation_status: "Vulnerable",
};

describe("AnimalCard Component", () => {
  it("renders animal details correctly", () => {
    render(<AnimalCard animal={mockAnimal} onSelect={() => {}} />);
    expect(screen.getByText("Simba")).toBeInTheDocument();
    expect(screen.getByText("Lion")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Vulnerable")).toBeInTheDocument();
  });

  it("calls onSelect when details button is clicked", () => {
    const handleSelect = vi.fn();
    render(<AnimalCard animal={mockAnimal} onSelect={handleSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /details/i }));
    expect(handleSelect).toHaveBeenCalledWith(mockAnimal);
  });
});
