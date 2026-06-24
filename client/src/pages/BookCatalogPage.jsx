import React, { useEffect, useState } from "react";
import { getBooks } from "../services/api.js";
import BookTable from "../components/books/BookTable.jsx";

const BookCatalogPage = ({ searchVal = "" }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const data = await getBooks(searchVal);
        setBooks(data);
      } catch (err) {
        // Silent catch or handle gracefully
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, [searchVal]);

  return (
    <div className="space-y-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Book Catalog
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          {searchVal
            ? `Search results for "${searchVal}"`
            : "Browse and manage all books in the library catalog."}
        </p>
      </div>

      <BookTable books={books} isLoading={isLoading} />
    </div>
  );
};

export default BookCatalogPage;
