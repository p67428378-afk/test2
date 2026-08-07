import React, { useState, useEffect } from "react";
import BookDetailsCard from "../components/book/BookDetailsCard.jsx";
import { bookService } from "../services/api.js";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function BookDetailsPage({ bookId, onBack, onEdit }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await bookService.getBook(bookId);
        setBook(data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load book details.");
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
      <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
        <span>Loading book details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2 max-w-2xl mx-auto">
        <AlertCircle className="h-5 w-5" />
        {error}
      </div>
    );
  }

  return <BookDetailsCard book={book} onBack={onBack} onEdit={onEdit} />;
}
