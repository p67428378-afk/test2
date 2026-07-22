import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Header from "./Header.jsx";

describe("Header Component", () => {
  it("renders search input and handles search query changes", () => {
    const onSearchChange = vi.fn();
    render(
      <Header
        searchQuery=""
        onSearchChange={onSearchChange}
        alertCount={0}
        onAlertsClick={vi.fn()}
      />,
    );

    const searchInput = screen.getByPlaceholderText("Search equipment...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "Thruster" } });
    expect(onSearchChange).toHaveBeenCalledWith("Thruster");
  });
});
