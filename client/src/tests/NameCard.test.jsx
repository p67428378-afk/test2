import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NameCard from "../components/generator/NameCard";

describe("NameCard Component", () => {
  it("renders character name and genre badge", () => {
    render(
      <NameCard
        name="Kaelen Cross"
        genre="cyberpunk"
        isFavorite={false}
        onCopy={vi.fn()}
        onToggleFavorite={vi.fn()}
      />,
    );

    expect(screen.getByText("Kaelen Cross")).toBeInTheDocument();
    expect(screen.getByText("cyberpunk")).toBeInTheDocument();
  });

  it("triggers onCopy handler when copy button is clicked", () => {
    const handleCopy = vi.fn();
    render(
      <NameCard
        name="Eldrin Shadowweaver"
        genre="fantasy"
        isFavorite={false}
        onCopy={handleCopy}
        onToggleFavorite={vi.fn()}
      />,
    );

    const copyBtn = screen.getByRole("button", {
      name: /Copy Eldrin Shadowweaver/i,
    });
    fireEvent.click(copyBtn);

    expect(handleCopy).toHaveBeenCalledWith("Eldrin Shadowweaver");
  });

  it("triggers onToggleFavorite handler when save button is clicked", () => {
    const handleToggle = vi.fn();
    render(
      <NameCard
        name="Vaelen Starstrider"
        genre="sci-fi"
        isFavorite={false}
        onCopy={vi.fn()}
        onToggleFavorite={handleToggle}
      />,
    );

    const saveBtn = screen.getByRole("button", {
      name: /Save Vaelen Starstrider/i,
    });
    fireEvent.click(saveBtn);

    expect(handleToggle).toHaveBeenCalledWith("Vaelen Starstrider", "sci-fi");
  });
});
