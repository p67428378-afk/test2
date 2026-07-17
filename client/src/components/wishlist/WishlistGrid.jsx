import React from "react";
import WishlistCard from "./WishlistCard.jsx";

export default function WishlistGrid({ items, onRemove }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container-low text-secondary mb-4">
          <span className="text-3xl">💝</span>
        </div>
        <h3 className="text-xl font-semibold text-on-surface mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-secondary max-w-md mx-auto">
          Explore our products and click the heart icon to save your favorite
          items here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} onRemove={onRemove} />
      ))}
    </div>
  );
}
