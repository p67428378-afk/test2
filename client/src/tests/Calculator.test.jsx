import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import AppHeader from "../components/AppHeader.jsx";
import DisplayBuffer from "../components/DisplayBuffer.jsx";
import KeypadButton from "../components/KeypadButton.jsx";
import KeypadGrid from "../components/KeypadGrid.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import AppFooter from "../components/AppFooter.jsx";
import CalculatorApp from "../components/CalculatorApp.jsx";
import * as api from "../services/api.js";

describe("Calculator Component Unit Tests", () => {
  it("renders AppHeader correctly", () => {
    render(<AppHeader isOnline={true} />);
    expect(screen.getByText(/Simple Calculator/i)).toBeInTheDocument();
    expect(screen.getByTestId("api-status-badge")).toHaveTextContent(
      "API Connected",
    );
  });

  it("renders DisplayBuffer with initial value and history", () => {
    render(
      <DisplayBuffer history="12 + 8" currentInput="20" isLoading={false} />,
    );
    expect(screen.getByTestId("display-history")).toHaveTextContent("12 + 8");
    expect(screen.getByTestId("display-current-input")).toHaveTextContent("20");
  });

  it("renders KeypadButton and triggers onClick", () => {
    const handleClick = vi.fn();
    render(
      <KeypadButton label="7" value="7" variant="num" onClick={handleClick} />,
    );
    const btn = screen.getByRole("button", { name: "7" });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledWith("7");
  });

  it("renders ErrorBanner and handles dismiss", () => {
    const handleDismiss = vi.fn();
    render(
      <ErrorBanner message="Cannot divide by zero" onDismiss={handleDismiss} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Cannot divide by zero",
    );
    const dismissBtn = screen.getByRole("button", { name: /Dismiss error/i });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalled();
  });

  it("renders AppFooter with microservice specs", () => {
    render(<AppFooter />);
    expect(screen.getByText(/FastAPI REST Engine/i)).toBeInTheDocument();
  });

  it("renders all keypad buttons in KeypadGrid", () => {
    const handleNumber = vi.fn();
    const handleOperator = vi.fn();
    const handleClear = vi.fn();
    const handleBackspace = vi.fn();
    const handlePercentage = vi.fn();
    const handleCalculate = vi.fn();

    render(
      <KeypadGrid
        onNumber={handleNumber}
        onOperator={handleOperator}
        onClear={handleClear}
        onBackspace={handleBackspace}
        onPercentage={handlePercentage}
        onCalculate={handleCalculate}
        isLoading={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: "All Clear" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Divide" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Multiply" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Subtract" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Equals" })).toBeInTheDocument();
  });
});

describe("CalculatorApp Integration & Calculation Tests", () => {
  beforeEach(() => {
    vi.spyOn(api, "checkHealth").mockResolvedValue({ status: "healthy" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates display buffer when numbers and operators are tapped", async () => {
    await act(async () => {
      render(<CalculatorApp />);
    });

    // Tap 1, 2
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByTestId("display-current-input")).toHaveTextContent("12");

    // Tap +
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByTestId("display-current-input")).toHaveTextContent(
      "12 +",
    );

    // Tap 8
    fireEvent.click(screen.getByRole("button", { name: "8" }));
    expect(screen.getByTestId("display-current-input")).toHaveTextContent(
      "12 + 8",
    );
  });

  it("calculates expression via API on equals click (12 + 8 = 20)", async () => {
    vi.spyOn(api, "calculateExpression").mockResolvedValue({
      result: 20,
      expression: "12 + 8",
      status: "success",
      timestamp: "2026-09-08T12:00:00Z",
    });

    await act(async () => {
      render(<CalculatorApp />);
    });

    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    fireEvent.click(screen.getByRole("button", { name: "8" }));
    fireEvent.click(screen.getByRole("button", { name: "Equals" }));

    await waitFor(() => {
      expect(screen.getByTestId("display-current-input")).toHaveTextContent(
        "20",
      );
      expect(screen.getByTestId("display-history")).toHaveTextContent(
        "12 + 8 =",
      );
    });

    expect(api.calculateExpression).toHaveBeenCalledWith("12 + 8");
  });

  it("handles division by zero error cleanly", async () => {
    vi.spyOn(api, "calculateExpression").mockRejectedValue({
      response: {
        data: {
          detail: "Cannot divide by zero",
          error_code: "DIVISION_BY_ZERO",
        },
      },
    });

    await act(async () => {
      render(<CalculatorApp />);
    });

    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "0" }));
    fireEvent.click(screen.getByRole("button", { name: "Divide" }));
    fireEvent.click(screen.getByRole("button", { name: "0" }));
    fireEvent.click(screen.getByRole("button", { name: "Equals" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Cannot divide by zero",
      );
    });
  });

  it("clears display and state on AC click", async () => {
    await act(async () => {
      render(<CalculatorApp />);
    });

    fireEvent.click(screen.getByRole("button", { name: "9" }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    expect(screen.getByTestId("display-current-input")).toHaveTextContent(
      "9 + 5",
    );

    fireEvent.click(screen.getByRole("button", { name: "All Clear" }));
    expect(screen.getByTestId("display-current-input")).toHaveTextContent("0");
  });
});
