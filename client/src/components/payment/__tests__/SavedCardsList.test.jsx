import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SavedCardsList from "../SavedCardsList.jsx";

describe("SavedCardsList", () => {
  const mockCards = [
    {
      id: "1",
      card_brand: "Visa",
      card_last_four: "4242",
      card_expiry_date: "2028-12-01",
    },
    {
      id: "2",
      card_brand: "Mastercard",
      card_last_four: "8812",
      card_expiry_date: "2027-05-01",
    },
  ];

  it("renders empty state when no cards are provided", () => {
    render(
      <SavedCardsList
        cards={[]}
        selectedCardId={null}
        onSelectCard={vi.fn()}
        cvv=""
        onCvvChange={vi.fn()}
      />,
    );
    expect(
      screen.getByText(/No saved payment methods found/i),
    ).toBeInTheDocument();
  });

  it("renders list of saved cards", () => {
    render(
      <SavedCardsList
        cards={mockCards}
        selectedCardId="1"
        onSelectCard={vi.fn()}
        cvv=""
        onCvvChange={vi.fn()}
      />,
    );
    expect(screen.getByText(/Ending in 4242/i)).toBeInTheDocument();
    expect(screen.getByText(/Ending in 8812/i)).toBeInTheDocument();
  });

  it("calls onSelectCard when a card is clicked", () => {
    const onSelectCard = vi.fn();
    render(
      <SavedCardsList
        cards={mockCards}
        selectedCardId="1"
        onSelectCard={onSelectCard}
        cvv=""
        onCvvChange={vi.fn()}
      />,
    );
    const secondCard = screen.getByText(/Ending in 8812/i);
    fireEvent.click(secondCard);
    expect(onSelectCard).toHaveBeenCalledWith("2");
  });
});
