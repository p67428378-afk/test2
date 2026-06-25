import React from "react";
import PropTypes from "prop-types";
import SavedCardRow from "./SavedCardRow.jsx";

export default function SavedCardsList({
  cards,
  selectedCardId,
  onSelectCard,
  cvv,
  onCvvChange,
}) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-slate-400 text-sm py-4 text-center border border-dashed border-slate-700 rounded-lg">
        No saved payment methods found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {cards.map((card) => (
        <SavedCardRow
          key={card.id}
          card={card}
          selectedCardId={selectedCardId}
          onSelect={onSelectCard}
          cvv={cvv}
          onCvvChange={onCvvChange}
        />
      ))}
    </div>
  );
}

SavedCardsList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      card_brand: PropTypes.string.isRequired,
      card_last_four: PropTypes.string.isRequired,
      card_expiry_date: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedCardId: PropTypes.string,
  onSelectCard: PropTypes.func.isRequired,
  cvv: PropTypes.string.isRequired,
  onCvvChange: PropTypes.func.isRequired,
};

SavedCardsList.defaultProps = {
  selectedCardId: null,
};
