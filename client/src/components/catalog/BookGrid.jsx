import React from "react";
import BookCard from "./BookCard";

export default function BookGrid({ books, onBorrow, user }) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant rounded-lg">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">
          search_off
        </span>
        <h3 className="text-lg font-semibold text-on-surface mb-1">
          No books found
        </h3>
        <p className="text-on-surface-variant">
          Try adjusting your search query or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onBorrow={onBorrow} user={user} />
      ))}
    </div>
  );
}
