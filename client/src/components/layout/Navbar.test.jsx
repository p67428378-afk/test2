import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { describe, it, expect } from "vitest";

describe("Navbar Component", () => {
  it("renders branding title and navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Q-Express Digital Queue/i)).toBeInTheDocument();
    expect(screen.getByText(/Join Line/i)).toBeInTheDocument();
    expect(screen.getByText(/Check Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Agent Portal/i)).toBeInTheDocument();
  });
});
