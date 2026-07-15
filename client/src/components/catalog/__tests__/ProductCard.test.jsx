import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ProductCard from "../ProductCard.jsx";

describe("ProductCard Component", () => {
  const mockProduct = {
    product_id: "p1",
    name: "Dino-Adventure Bento",
    description:
      "Fun dinosaur themed lunch box with leakproof compartments, perfect for kids.",
    price: 24.99,
    image_urls: [
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&auto=format&fit=crop&q=60",
    ],
    category: "Kids",
    rating: 4.9,
    review_count: 124,
    tags: ["Bestseller", "Leakproof"],
  };

  it("renders product details correctly", () => {
    render(<ProductCard product={mockProduct} onAddToCart={vi.fn()} />);

    expect(screen.getByText("Dino-Adventure Bento")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Fun dinosaur themed lunch box with leakproof compartments, perfect for kids.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("$24.99")).toBeInTheDocument();
    expect(screen.getByText("Kids")).toBeInTheDocument();
    expect(screen.getByText("Leakproof")).toBeInTheDocument();
    expect(screen.getByText("Bestseller")).toBeInTheDocument();
  });

  it("calls onAddToCart when the add button is clicked", () => {
    const handleAddToCart = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);

    const button = screen.getByRole("button", {
      name: /add dino-adventure bento to cart/i,
    });
    fireEvent.click(button);

    expect(handleAddToCart).toHaveBeenCalledWith("p1");
  });
});
