import React from "react";
import BookCard from "./BookCard.jsx";

export default function BookGrid({ books }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {books.map((book) => (
        <BookCard key={book.id || book.isbn} book={book} />
      ))}
    </div>
  );
}
