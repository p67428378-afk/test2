import React, { useState, useEffect } from "react";
import BookCatalogTable from "../components/catalog/BookCatalogTable.jsx";
import AddBookModal from "../components/catalog/AddBookModal.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import Button from "../components/common/Button.jsx";
import { bookService } from "../services/api.js";
import { Plus } from "lucide-react";

export default function BookCatalogManagement() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks(search);
      setBooks(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load book catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  const handleAddOrEditBook = async (bookData) => {
    try {
      if (bookToEdit) {
        await bookService.updateBook(bookToEdit.id, bookData);
      } else {
        await bookService.createBook(bookData);
      }
      setIsModalOpen(false);
      setBookToEdit(null);
      fetchBooks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save book.");
    }
  };

  const handleEditClick = (book) => {
    setBookToEdit(book);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await bookService.deleteBook(bookId);
      fetchBooks();
    } catch (err) {
      setError("Failed to delete book.");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search catalog by title, author, or ISBN..."
        />
        <Button
          variant="primary"
          onClick={() => {
            setBookToEdit(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="h-5 w-5" />
          Add Book
        </Button>
      </div>

      {loading && books.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          Loading catalog...
        </div>
      ) : (
        <BookCatalogTable
          books={books}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      <AddBookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setBookToEdit(null);
        }}
        onSubmit={handleAddOrEditBook}
        bookToEdit={bookToEdit}
      />
    </div>
  );
}
