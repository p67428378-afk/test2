import React from "react";
import Button from "../common/Button.jsx";
import Badge from "../common/Badge.jsx";

export default function BookCard({ book, onBorrow, isLibrarian }) {
  const isAvailable = book.available_copies > 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-slate-600 transition-all">
      <div>
        {/* Cover Placeholder */}
        <div className="aspect-[3/4] w-full bg-slate-900 rounded-lg mb-4 flex flex-col items-center justify-center text-slate-600 border border-slate-800 relative overflow-hidden">
          <span className="text-4xl font-bold opacity-20">BOOK</span>
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <p className="text-xs text-slate-500 truncate">
              {book.genre || "General"}
            </p>
          </div>
        </div>

        <h4
          className="font-bold text-slate-100 text-base line-clamp-1"
          title={book.title}
        >
          {book.title}
        </h4>
        <p className="text-sm text-slate-400 mt-1 line-clamp-1">
          {book.author}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-500">ISBN: {book.isbn}</span>
          <Badge variant={isAvailable ? "success" : "danger"}>
            {isAvailable
              ? `${book.available_copies} Available`
              : "Out of Stock"}
          </Badge>
        </div>
      </div>

      {!isLibrarian && (
        <div className="mt-5">
          <Button
            variant="primary"
            className="w-full"
            disabled={!isAvailable}
            onClick={() => onBorrow(book.id)}
          >
            {isAvailable ? "Borrow Book" : "Unavailable"}
          </Button>
        </div>
      )}
    </div>
  );
}
