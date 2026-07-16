import React, { useState, useEffect } from "react";
import { booksApi } from "../services/api";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

export default function DetailPage({ bookId, onBack, onAddToCart }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await booksApi.get(bookId);
        setBook(data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-xl gap-sm">
        <RefreshCw className="animate-spin text-gold" size={48} />
        <p className="font-body-lg text-on-surface-variant">
          Summoning book details...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="p-lg bg-error-container text-on-error-container rounded-lg border border-error/20 text-center flex flex-col gap-md max-w-xl mx-auto">
        <p className="font-body-lg">{error || "Book not found."}</p>
        <button
          onClick={onBack}
          className="bg-gold hover:bg-[#B45309] text-white font-label-md py-2 px-4 rounded self-center transition-all active:scale-95 flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>
      </div>
    );
  }

  const isOutOfStock = book.stock_quantity <= 0;

  return (
    <div className="flex flex-col gap-md">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md self-start"
      >
        <ArrowLeft size={18} /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-white rounded-lg border border-[#E2E8F0] p-md shadow-ambient">
        {/* Left: Large Cover Image */}
        <div className="relative aspect-[3/4] w-full bg-surface-container overflow-hidden p-md flex items-center justify-center rounded-lg border border-[#E2E8F0]">
          <img
            src={book.cover_image_url}
            alt={book.title}
            className={`max-h-full max-w-full object-contain rounded shadow-lg ${isOutOfStock ? "grayscale-[0.3]" : ""}`}
          />
          {book.format && (
            <span className="absolute top-4 right-4 magic-chip font-label-sm px-3 py-1 rounded-full shadow-sm z-10 backdrop-blur-sm bg-white/80 border border-[#FEF3C7]">
              {book.format}
            </span>
          )}
        </div>

        {/* Right: Detailed Information */}
        <div className="flex flex-col justify-between gap-md">
          <div className="flex flex-col gap-sm">
            <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface leading-tight tracking-tight">
              {book.title}
            </h1>
            <div className="flex items-center gap-md border-y border-[#E2E8F0] py-sm">
              <span className="font-display-lg-mobile font-bold text-primary">
                ${Number(book.price).toFixed(2)}
              </span>
              {isOutOfStock ? (
                <span className="font-label-sm text-error flex items-center gap-1 bg-red-50 px-2 py-1 rounded border border-error/10">
                  <XCircle size={16} /> Out of Stock
                </span>
              ) : (
                <span className="font-label-sm text-[#059669] flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                  <CheckCircle size={16} /> In Stock ({book.stock_quantity}{" "}
                  available)
                </span>
              )}
            </div>
            <div className="flex flex-col gap-xs font-label-md text-on-surface-variant">
              <p>
                <strong className="text-on-surface">ISBN-13:</strong>{" "}
                {book.isbn}
              </p>
              <p>
                <strong className="text-on-surface">Format:</strong>{" "}
                {book.format}
              </p>
            </div>
            <div className="mt-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                Description
              </h3>
              <p className="font-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-md mt-auto">
            {isOutOfStock ? (
              <button
                className="w-full bg-surface-variant text-on-surface-variant font-headline-sm py-3 rounded cursor-not-allowed border border-outline-variant flex items-center justify-center gap-2"
                disabled
              >
                Notify Me When Available
              </button>
            ) : (
              <button
                className="w-full bg-gold hover:bg-[#B45309] text-white font-headline-sm py-3 rounded transition-colors active:scale-95 flex items-center justify-center gap-2 shadow-md"
                onClick={() => onAddToCart(book.id)}
              >
                <ShoppingCart size={20} /> Add to Shopping Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
