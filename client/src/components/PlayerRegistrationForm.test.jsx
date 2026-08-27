import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PlayerRegistrationForm from "./PlayerRegistrationForm";

describe("PlayerRegistrationForm Component", () => {
  it("renders form fields correctly", () => {
    render(<PlayerRegistrationForm />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Initial Rating/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Submit Registration/i }),
    ).toBeInTheDocument();
  });

  it("updates field values on input", () => {
    render(<PlayerRegistrationForm />);

    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);

    fireEvent.change(nameInput, { target: { value: "Hikaru Nakamura" } });
    fireEvent.change(emailInput, { target: { value: "hikaru@example.com" } });

    expect(nameInput.value).toBe("Hikaru Nakamura");
    expect(emailInput.value).toBe("hikaru@example.com");
  });
});
