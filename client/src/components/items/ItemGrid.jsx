import React from "react";
import ItemCard from "./ItemCard";

export default function ItemGrid({ items, activeItemId, onItemClick }) {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
        <p className="text-slate-500">No items found matching the criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isActive={item.id === activeItemId}
          onClick={() => onItemClick(item)}
        />
      ))}
    </div>
  );
}
