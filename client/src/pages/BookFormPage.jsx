import React, { useState, useEffect } from "react";
import BookForm from "../components/book/BookForm.jsx";
import { bookService } from "../services/api.js";
import { RefreshCw } from "lucide-react";

export default function BookFormPage({ bookId, onSave, onCancel }) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
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
        setError("Failed to load book details for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleSubmit = async (formData) => {
    try {
      setError("");
      if (bookId) {
        await bookService.updateBook(bookId, formData);
      } else {
        await bookService.createBook(formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail;
      if (typeof detail === "string") {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(", "));
      } else {
        setError(
          "An error occurred while saving the book. Please check the ISBN or other fields.",
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
        <span>Loading book details...</span>
      </div>
    );
  }

  return (
    <BookForm
      initialData={book}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      error={error}
    />
  );
}
