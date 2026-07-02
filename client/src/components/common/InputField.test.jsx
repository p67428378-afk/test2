import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import InputField from "./InputField";

describe("InputField Component", () => {
  it("renders input field with label and placeholder", () => {
    render(
      <InputField
        label="Email Address"
        name="email"
        value=""
        onChange={() => {}}
        placeholder="Enter your email"
      />,
    );

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
  });

  it("calls onChange handler when value changes", () => {
    const handleChange = vi.fn();
    render(
      <InputField
        label="Email Address"
        name="email"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByLabelText(/Email Address/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("displays error message when error prop is provided", () => {
    render(
      <InputField
        label="Email Address"
        name="email"
        value=""
        onChange={() => {}}
        error="Invalid email address"
      />,
    );

    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });
});
