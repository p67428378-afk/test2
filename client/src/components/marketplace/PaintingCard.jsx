import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../layout/AppLayout";

export default function PaintingCard({ painting }) {
  const { addToCart, error, setError, setSuccessMessage } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    setSuccessMessage("");
    await addToCart(painting.id);
  };

  return (
    <article className="group relative flex flex-col bg-surface hover:shadow-lg transition-shadow duration-300 rounded border border-transparent hover:border-outline-variant overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low">
        <img
          alt={painting.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={painting.image_url}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link
            className="bg-surface text-primary font-label-caps text-label-caps px-6 py-2 rounded shadow-md hover:bg-primary hover:text-on-primary transition-colors"
            to={`/paintings/${painting.id}`}
          >
            View Details
          </Link>
        </div>
        <button
          aria-label="Add to cart"
          onClick={handleAddToCart}
          className="absolute top-3 right-3 bg-surface p-2 rounded-full shadow-sm text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0"
        >
          <span className="material-symbols-outlined text-[20px]">
            add_shopping_cart
          </span>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-body-md text-body-md font-semibold text-on-surface truncate">
          {painting.title}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
          {painting.artist_name}
        </p>
        <div className="mt-auto flex justify-between items-end">
          <span className="font-body-md text-body-md text-primary font-semibold">
            ${parseFloat(painting.price).toFixed(2)}
          </span>
          {painting.dimensions && (
            <span className="font-body-sm text-body-sm text-tertiary text-[12px]">
              {painting.dimensions}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
