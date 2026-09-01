import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import SignupPage from "./SignupPage";
import * as api from "../services/api";

vi.mock("../services/api", () => ({
  registerUser: vi.fn(),
}));

describe("SignupPage Component", () => {
  it("renders signup form with headings and inputs", () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /create your account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/jane.doe@example.com/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
  });

  it("populates test credentials on clicking Fill Sample button", () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const fillBtn = screen.getByRole("button", { name: /fill sample/i });
    fireEvent.click(fillBtn);

    const emailInput = screen.getByPlaceholderText(/jane.doe@example.com/i);
    expect(emailInput.value).toBe("test@example.com");
  });

  it("shows error message if passwords do not match", async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>,
    );

    const fillBtn = screen.getByRole("button", { name: /fill sample/i });
    fireEvent.click(fillBtn);

    const confirmPasswordInputs =
      screen.getAllByPlaceholderText(/••••••••••••/i);
    fireEvent.change(confirmPasswordInputs[1], {
      target: { value: "differentpassword" },
    });

    const submitBtn = screen.getByRole("button", { name: /create account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /passwords do not match/i,
    );
  });
});
