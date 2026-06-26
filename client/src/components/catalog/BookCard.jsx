import React, { useState } from "react";

export default function BookCard({ book, onBorrow, user }) {
  const [loading, setLoading] = useState(false);
  const isAvailable = book.available_copies > 0;
  const isMember = user?.role === "member";

  const handleBorrowClick = async () => {
    if (!user) {
      alert("Please sign in to borrow books.");
      return;
    }
    if (!isMember) {
      alert("Only members can borrow books.");
      return;
    }
    setLoading(true);
    try {
      await onBorrow(book.id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 ${!isAvailable ? "opacity-75" : ""}`}
    >
      <div className="h-48 bg-surface-container-low flex items-center justify-center relative border-b border-outline-variant">
        <div
          className={`w-24 h-32 bg-surface shadow-sm border border-outline-variant rounded flex flex-col items-center justify-center p-2 text-center shadow-md ${!isAvailable ? "opacity-60" : ""}`}
        >
          <span className="material-symbols-outlined text-outline-variant text-4xl mb-2">
            {book.title.toLowerCase().includes("code") ? "code" : "book"}
          </span>
        </div>
        {isAvailable ? (
          <div className="absolute top-3 right-3 bg-tertiary-container/10 text-tertiary-container px-2 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
            Available ({book.available_copies})
          </div>
        ) : (
          <div className="absolute top-3 right-3 bg-error/10 text-error px-2 py-1 rounded-full font-label-sm text-label-sm flex items-center gap-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-headline-sm text-[18px] leading-tight text-on-surface mb-1">
          {book.title}
        </h3>
        <p className="font-body-md text-body-sm text-on-surface-variant mb-3">
          {book.author}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-container-high">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant opacity-70">
              ISBN
            </span>
            <span className="font-label-sm text-label-md text-on-surface">
              {book.isbn}
            </span>
          </div>
          {isAvailable ? (
            <button
              onClick={handleBorrowClick}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-label-md text-label-md py-2 px-4 rounded transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Borrowing..." : "Borrow"}
            </button>
          ) : (
            <button
              className="bg-surface-container text-on-surface-variant font-label-md text-label-md py-2 px-4 rounded cursor-not-allowed border border-outline-variant border-opacity-50"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
