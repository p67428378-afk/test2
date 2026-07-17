import React, { useState, useEffect } from "react";
import { wishlistService } from "../services/api.js";
import WishlistGrid from "../components/wishlist/WishlistGrid.jsx";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function WishlistPage({ onBack, onShowNotification }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setItems(data);
      setError("");
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await wishlistService.removeFromWishlist(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      onShowNotification("Item removed from wishlist", "success");
    } catch (err) {
      console.error("Error removing item:", err);
      onShowNotification("Failed to remove item", "error");
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-xl">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-outline-variant hover:border-primary text-secondary hover:text-primary bg-surface-container-lowest transition-colors"
          aria-label="Back to product"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">My Wishlist</h1>
          <p className="text-secondary text-sm">Manage your saved items</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-secondary">Loading your wishlist...</p>
        </div>
      ) : error ? (
        <div className="bg-error-container/20 border border-error text-error p-4 rounded-xl text-center max-w-md mx-auto my-10">
          <p className="font-semibold mb-2">{error}</p>
          <button
            onClick={fetchWishlist}
            className="bg-error text-on-error px-4 py-2 rounded-lg text-sm font-medium hover:bg-error/90 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <WishlistGrid items={items} onRemove={handleRemove} />
      )}
    </div>
  );
}
