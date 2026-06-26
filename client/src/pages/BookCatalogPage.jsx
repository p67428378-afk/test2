import React, { useState, useEffect } from "react";
import BookGrid from "../components/catalog/BookGrid";
import { bookService, loanService } from "../services/api";

export default function BookCatalogPage({ user, searchQuery }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getBooks(searchQuery);
      setBooks(data);
    } catch (err) {
      setError("Failed to fetch books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchQuery]);

  const handleBorrow = async (bookId) => {
    setError("");
    setSuccess("");
    try {
      // 1. Get book details to find an available copy
      const bookDetails = await bookService.getBookDetails(bookId);
      const availableCopy = bookDetails.copies.find(
        (copy) => copy.status === "available",
      );

      if (!availableCopy) {
        setError("No available copies of this book found.");
        return;
      }

      // 2. Borrow the copy
      await loanService.borrowBook(availableCopy.id);
      setSuccess(`Successfully borrowed "${bookDetails.title}"!`);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to borrow book.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-stack-xs">
          Book Catalog
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Browse and borrow from our collection of books
        </p>
      </div>

      {error && (
        <div className="p-4 bg-error/10 text-error rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-tertiary-container/10 text-tertiary-container rounded-lg text-sm font-medium">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <BookGrid books={books} onBorrow={handleBorrow} user={user} />
      )}
    </div>
  );
}
