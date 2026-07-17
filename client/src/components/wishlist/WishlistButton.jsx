import React from "react";
import { Heart } from "lucide-react";

export default function WishlistButton({ isSaved, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={isSaved ? "Remove from Wishlist" : "Save to Wishlist"}
      className={`flex items-center justify-center border rounded-lg h-[44px] px-md transition-colors duration-200 ${
        isSaved
          ? "border-error text-error bg-error-container/20 hover:bg-error-container/40"
          : "border-primary text-primary hover:bg-surface-container-low"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
    </button>
  );
}
