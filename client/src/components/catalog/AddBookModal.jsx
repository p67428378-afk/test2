import React, { useState, useEffect } from "react";
import Modal from "../common/Modal.jsx";
import Button from "../common/Button.jsx";

export default function AddBookModal({
  isOpen,
  onClose,
  onSubmit,
  bookToEdit,
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [totalCopies, setTotalCopies] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookToEdit) {
      setTitle(bookToEdit.title || "");
      setAuthor(bookToEdit.author || "");
      setIsbn(bookToEdit.isbn || "");
      setGenre(bookToEdit.genre || "");
      setPublicationYear(bookToEdit.publication_year || "");
      setTotalCopies(bookToEdit.total_copies || 1);
    } else {
      setTitle("");
      setAuthor("");
      setIsbn("");
      setGenre("");
      setPublicationYear("");
      setTotalCopies(1);
    }
    setError("");
  }, [bookToEdit, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author || !isbn) {
      setError("Title, Author, and ISBN are required.");
      return;
    }

    const bookData = {
      title,
      author,
      isbn,
      genre: genre || null,
      publication_year: publicationYear ? parseInt(publicationYear, 10) : null,
      total_copies: parseInt(totalCopies, 10) || 1,
    };

    onSubmit(bookData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookToEdit ? "Edit Book" : "Add New Book"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="e.g. The Great Gatsby"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Author *
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="e.g. F. Scott Fitzgerald"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            ISBN *
          </label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            placeholder="e.g. 9780743273565"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Genre
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              placeholder="e.g. Fiction"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase">
              Publication Year
            </label>
            <input
              type="number"
              value={publicationYear}
              onChange={(e) => setPublicationYear(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
              placeholder="e.g. 1925"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Total Copies
          </label>
          <input
            type="number"
            min="1"
            value={totalCopies}
            onChange={(e) => setTotalCopies(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {bookToEdit ? "Save Changes" : "Add Book"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
