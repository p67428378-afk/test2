import React from "react";

export default function CartItemRow({ item, onRemove }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-outline-variant gap-4 bg-surface rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img
          alt={item.title}
          className="w-20 h-20 object-cover rounded bg-surface-container-low"
          src={item.image_url}
        />
        <div>
          <h4 className="font-body-md text-body-md font-semibold text-on-surface">
            {item.title}
          </h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Quantity: {item.quantity} (non-editable)
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
        <span className="font-body-md text-body-md text-primary font-semibold">
          ${parseFloat(item.price).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(item.id)}
          className="text-error hover:text-on-error-container font-label-caps text-label-caps flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Remove
        </button>
      </div>
    </div>
  );
}
