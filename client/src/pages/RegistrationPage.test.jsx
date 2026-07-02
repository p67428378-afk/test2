import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import RegistrationPage from "./RegistrationPage";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  registerUser: vi.fn(),
}));

describe("RegistrationPage Component", () => {
  it("renders registration form fields", () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(
      await screen.findByText("First name is required."),
    ).toBeInTheDocument();
    expect(screen.getByText("Last name is required.")).toBeInTheDocument();
    expect(screen.getByText("Email is required.")).toBeInTheDocument();
    expect(screen.getByText("Password is required.")).toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    api.registerUser.mockResolvedValueOnce({ message: "Success" });

    render(
      <MemoryRouter>
        <RegistrationPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: "john.doe@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(api.registerUser).toHaveBeenCalledWith({
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "Password123!",
      });
    });
  });
});
