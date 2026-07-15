import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import RegistrationForm from "./components/visitor/RegistrationForm";

describe("RegistrationForm Smoke Test", () => {
  it("renders registration form fields", () => {
    render(
      <RegistrationForm
        onRegisterSuccess={() => {}}
        onToggleLogin={() => {}}
      />,
    );
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Government ID/i)).toBeInTheDocument();
  });
});
