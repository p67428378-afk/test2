import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import Header from "./Header";
import { AuthProvider } from "../../context/AuthContext";

describe("Header Component", () => {
  it("renders branding title and navigation links", () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("Museum Tours")).toBeInTheDocument();
    expect(screen.getByText("Tour Catalog")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
