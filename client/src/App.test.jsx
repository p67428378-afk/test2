import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthContext } from "./context/AuthContext";

describe("Navbar Component", () => {
  it("renders application brand title", () => {
    const mockAuthContext = {
      user: { email: "test@example.com", role: "CUSTOMER" },
      token: "mock-token",
      loading: false,
      login: () => {},
      logout: () => {},
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText(/AquaFlow Dispatch/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
