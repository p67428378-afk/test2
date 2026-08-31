import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ShippingSelector from "./ShippingSelector";

describe("ShippingSelector Component", () => {
  it("renders both shipping options: Standard Ground and Express Thermal", () => {
    const onChangeMock = vi.fn();
    render(
      <ShippingSelector
        selectedMethod="standard_ground"
        onChange={onChangeMock}
        hasHeatSensitiveItems={true}
      />,
    );

    expect(screen.getByText("Standard Ground")).toBeInTheDocument();
    expect(screen.getByText("Express Thermal Delivery")).toBeInTheDocument();
    expect(screen.getByText("FREE")).toBeInTheDocument();
    expect(screen.getByText("$15.00")).toBeInTheDocument();
    expect(
      screen.getByText(/Heat-Sensitive Items in Order/i),
    ).toBeInTheDocument();
  });

  it("triggers onChange when switching shipping methods", () => {
    const onChangeMock = vi.fn();
    render(
      <ShippingSelector
        selectedMethod="standard_ground"
        onChange={onChangeMock}
        hasHeatSensitiveItems={false}
      />,
    );

    const expressOption = screen.getByTestId("shipping-option-express-thermal");
    fireEvent.click(expressOption);

    expect(onChangeMock).toHaveBeenCalledWith("express_thermal");
  });
});
