import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import ChocolateCard from "./ChocolateCard";
import CartContext from "../../context/CartContext";

const mockChocolate = {
  id: "choc-123",
  title: "Madagascar Single-Origin 72%",
  description: "Single-origin dark chocolate with vibrant citrus.",
  cocoa_percentage: 72,
  origin_region: "Madagascar",
  flavor_notes: "Floral, Fruity, Citrus",
  dietary_flags: "Vegan, Organic",
  price: 12.0,
  stock_quantity: 10,
  is_heat_sensitive: true,
};

const renderWithContext = (chocolate, cartContextValue = {}) => {
  const defaultContext = {
    addItem: vi.fn().mockResolvedValue({}),
    cart: { items: [] },
    subtotal: 0,
    itemCount: 0,
    isDrawerOpen: false,
    openDrawer: vi.fn(),
    closeDrawer: vi.fn(),
    ...cartContextValue,
  };

  return render(
    <BrowserRouter>
      <CartContext.Provider value={defaultContext}>
        <ChocolateCard chocolate={chocolate} />
      </CartContext.Provider>
    </BrowserRouter>,
  );
};

describe("ChocolateCard Component", () => {
  it("renders chocolate title, cocoa percentage, origin, and price correctly", () => {
    renderWithContext(mockChocolate);

    expect(
      screen.getByText("Madagascar Single-Origin 72%"),
    ).toBeInTheDocument();
    expect(screen.getByText("72% Cocoa")).toBeInTheDocument();
    expect(screen.getByText("Madagascar")).toBeInTheDocument();
    expect(screen.getByText("$12.00")).toBeInTheDocument();
    expect(screen.getByText(/Heat-Sensitive/i)).toBeInTheDocument();
  });

  it("calls addItem when Add button is clicked", async () => {
    const addItemMock = vi.fn().mockResolvedValue({});
    renderWithContext(mockChocolate, { addItem: addItemMock });

    const addButton = screen.getByRole("button", {
      name: /Add Madagascar Single-Origin 72% to cart/i,
    });
    fireEvent.click(addButton);

    expect(addItemMock).toHaveBeenCalledWith(mockChocolate, 1);
  });

  it("renders Out of Stock badge and disables button when stock is 0", () => {
    const outOfStockChoc = {
      ...mockChocolate,
      stock_quantity: 0,
    };

    renderWithContext(outOfStockChoc);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    const button = screen.getByRole("button", {
      name: /Add Madagascar Single-Origin 72% to cart/i,
    });
    expect(button).toBeDisabled();
  });
});
