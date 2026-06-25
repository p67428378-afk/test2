import React from "react";
import { Trash2, CreditCard } from "lucide-react";

export default function SavedCardCard({ card, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between h-48">
      {/* Background decorative circles */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-xl"></div>
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-slate-500/10 rounded-full blur-xl"></div>

      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-3">
          <CreditCard className="text-indigo-400 w-8 h-8" />
          <span className="font-bold text-lg tracking-wider text-indigo-300 uppercase">
            {card.card_brand}
          </span>
        </div>
        <button
          onClick={() => onDelete(card)}
          className="text-slate-400 hover:text-red-400 transition-colors p-1.5 hover:bg-slate-800 rounded-lg"
          title="Delete Card"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="my-4 z-10">
        <p className="text-slate-400 text-xs tracking-widest uppercase mb-1">
          Card Number
        </p>
        <p className="text-xl font-mono tracking-widest text-slate-100">
          •••• •••• •••• {card.card_last_four}
        </p>
      </div>

      <div className="flex justify-between items-end z-10">
        <div>
          <p className="text-slate-400 text-[10px] tracking-widest uppercase">
            Expires
          </p>
          <p className="text-sm font-medium text-slate-200">
            {card.card_expiry_date.substring(5, 7)}/
            {card.card_expiry_date.substring(2, 4)}
          </p>
        </div>
        <div className="bg-slate-800/80 px-2 py-1 rounded text-[10px] font-semibold text-slate-400 border border-slate-700">
          SECURE
        </div>
      </div>
    </div>
  );
}
