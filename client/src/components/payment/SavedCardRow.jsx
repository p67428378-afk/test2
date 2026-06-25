import React from "react";

export default function SavedCardRow({
  card,
  selectedCardId,
  onSelect,
  cvv,
  onCvvChange,
}) {
  const isSelected = card.id === selectedCardId;

  return (
    <div
      onClick={() => onSelect(card.id)}
      className={`border rounded-lg p-md flex flex-col gap-sm transition-colors cursor-pointer ${
        isSelected
          ? "border-indigo-500 bg-slate-800"
          : "border-slate-700 hover:border-slate-600 bg-slate-900"
      }`}
    >
      <div className="flex items-center gap-md">
        <div className={`radio-custom ${isSelected ? "selected" : ""}`}></div>
        <div className="flex-grow flex items-center gap-sm">
          <span className="font-bold italic text-blue-400 uppercase">
            {card.card_brand}
          </span>
          <span className="font-body-md text-body-md text-slate-100">
            Ending in {card.card_last_four} (Exp {card.card_expiry_date})
          </span>
        </div>
      </div>

      {isSelected && (
        <div
          className="pl-[44px] flex items-center gap-sm mt-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex items-center">
            <input
              type="password"
              maxLength="4"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => onCvvChange(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md py-2 px-3 w-24 font-body-sm text-body-sm text-slate-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="group relative cursor-pointer flex items-center">
            <span className="material-symbols-outlined text-slate-400 text-sm">
              info
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-700 text-white font-label-sm text-xs rounded shadow-lg z-10 text-center pointer-events-none">
              For security, please enter your 3 or 4-digit CVV
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
