import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "./ProductCard";

describe("ProductCard Component", () => {
  const mockProduct = {
    id: "prod-101",
    name: "Wireless Noise Canceling Headphones",
    category: "Audio",
    description: "Crisp audio with 30h battery life.",
    price: 199.99,
    rating: 4.8,
    tags: ["wireless", "audio"],
    in_stock: true,
  };

  it("renders product details correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(
      screen.getByText("Wireless Noise Canceling Headphones"),
    ).toBeInTheDocument();
    expect(screen.getByText("Audio")).toBeInTheDocument();
    expect(screen.getByText("$199.99")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
    expect(screen.getByText("#wireless")).toBeInTheDocument();
    expect(screen.getByText("#audio")).toBeInTheDocument();
  });

  it("handles add to cart action", () => {
    const handleAdd = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAdd} />);

    const button = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(button);

    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith(mockProduct);
  });

  it("renders out of stock state properly", () => {
    const outOfStockProduct = { ...mockProduct, in_stock: false };
    render(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: /add to cart/i });
    expect(button).toBeDisabled();
  });
});
