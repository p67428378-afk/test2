import React from "react";
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react";

export default function ProductCard({ book, onAddToCart, onClick }) {
  const isOutOfStock = book.stock_quantity <= 0;

  return (
    <article
      className={`bg-white rounded-lg shadow-ambient hover:shadow-ambient-hover transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border border-[#E2E8F0] group ${isOutOfStock ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !isOutOfStock && onClick && onClick(book.id)}
    >
      <div className="relative aspect-[3/4] w-full bg-surface-container overflow-hidden p-md flex items-center justify-center">
        <img
          src={book.cover_image_url}
          alt={book.title}
          className={`w-full h-full object-cover rounded shadow-md group-hover:scale-105 transition-transform duration-500 ${isOutOfStock ? "grayscale-[0.3]" : ""}`}
        />
        {book.format && (
          <span className="absolute top-2 right-2 magic-chip font-label-sm px-2 py-0.5 rounded shadow-sm z-10 backdrop-blur-sm bg-white/80 border border-[#FEF3C7]">
            {book.format}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-surface-variant text-on-surface-variant font-label-md px-3 py-1 rounded shadow-sm border border-outline-variant font-bold tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="p-sm flex flex-col flex-1 justify-between gap-sm">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight mb-1 line-clamp-2 group-hover:text-gold transition-colors">
            {book.title}
          </h3>
          <p className="font-label-md text-secondary/70 line-clamp-1">
            ISBN: {book.isbn}
          </p>
        </div>
        <div className="flex flex-col gap-xs mt-auto">
          <div className="flex items-end justify-between">
            <span className="font-headline-md text-headline-md text-on-surface font-bold">
              ${Number(book.price).toFixed(2)}
            </span>
            {isOutOfStock ? (
              <span className="font-label-sm text-error flex items-center gap-1">
                <XCircle size={14} /> Out of Stock
              </span>
            ) : (
              <span className="font-label-sm text-[#059669] flex items-center gap-1">
                <CheckCircle size={14} /> In Stock ({book.stock_quantity})
              </span>
            )}
          </div>
          {isOutOfStock ? (
            <button
              className="w-full bg-surface-variant text-on-surface-variant font-label-md py-2 rounded cursor-not-allowed border border-outline-variant mt-2 flex items-center justify-center gap-2"
              disabled
            >
              Notify Me
            </button>
          ) : (
            <button
              className="w-full bg-gold hover:bg-[#B45309] text-white font-label-md py-2 rounded transition-colors active:scale-95 flex items-center justify-center gap-2 mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(book.id);
              }}
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
