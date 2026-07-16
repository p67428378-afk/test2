import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-md py-sm border-b border-[#E2E8F0] last:border-0">
      <img
        src={item.cover_image_url}
        alt={item.title}
        className="w-16 h-20 object-cover rounded shadow-sm border border-[#E2E8F0]"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">
          {item.title}
        </h4>
        <p className="font-label-md text-secondary/70">
          ${Number(item.price).toFixed(2)} each
        </p>
      </div>
      <div className="flex items-center gap-sm">
        <button
          className="p-1 rounded border border-[#E2E8F0] hover:bg-surface-variant/50 active:scale-95 transition-all"
          onClick={() => onUpdateQuantity(item.book_id, item.quantity - 1)}
          disabled={item.quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="font-headline-sm text-headline-sm w-8 text-center">
          {item.quantity}
        </span>
        <button
          className="p-1 rounded border border-[#E2E8F0] hover:bg-surface-variant/50 active:scale-95 transition-all"
          onClick={() => onUpdateQuantity(item.book_id, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="text-right min-w-[80px]">
        <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
          ${Number(item.subtotal).toFixed(2)}
        </p>
        <button
          className="text-error hover:text-red-700 font-label-sm flex items-center gap-1 ml-auto mt-1"
          onClick={() => onRemove(item.book_id)}
        >
          <Trash2 size={14} /> Remove
        </button>
      </div>
    </div>
  );
}
