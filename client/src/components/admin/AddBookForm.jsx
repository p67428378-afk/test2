import React, { useState } from "react";

export default function AddBookForm({ onAddBook }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [initialCopies, setInitialCopies] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onAddBook({
        title,
        author,
        isbn,
        published_date: publishedDate || null,
        initial_copies: parseInt(initialCopies, 10),
      });
      setSuccess("Book added successfully!");
      setTitle("");
      setAuthor("");
      setIsbn("");
      setPublishedDate("");
      setInitialCopies(1);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to add book. Please check ISBN uniqueness.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4 shadow-sm"
    >
      <h3 className="text-lg font-semibold text-on-surface mb-4">
        Add New Book
      </h3>

      {error && (
        <div className="p-3 bg-error/10 text-error rounded text-sm font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-tertiary-container/10 text-tertiary-container rounded text-sm font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="title"
          >
            Book Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="e.g. The Hobbit"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="author"
          >
            Author *
          </label>
          <input
            type="text"
            id="author"
            required
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="block w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="e.g. J.R.R. Tolkien"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="isbn"
          >
            ISBN *
          </label>
          <input
            type="text"
            id="isbn"
            required
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="block w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="e.g. 978-0261102217"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="publishedDate"
          >
            Published Date
          </label>
          <input
            type="date"
            id="publishedDate"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            className="block w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-on-surface-variant mb-1"
            htmlFor="initialCopies"
          >
            Initial Copies *
          </label>
          <input
            type="number"
            id="initialCopies"
            required
            min="1"
            value={initialCopies}
            onChange={(e) => setInitialCopies(e.target.value)}
            className="block w-full px-3 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-white font-label-md text-label-md py-2 px-6 rounded transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </div>
    </form>
  );
}
