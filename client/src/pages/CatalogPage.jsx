import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import BookTable from "../components/catalog/BookTable";
import { bookService } from "../services/api";
import { Plus, X, CheckCircle2, AlertCircle } from "lucide-react";

const CatalogPage = () => {
  const [books, setBooks] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingBook, setEditBook] = React.useState(null);

  // Form states
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [isbn, setIsbn] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [copiesTotal, setCopiesTotal] = React.useState(1);

  // Status states
  const [formError, setFormError] = React.useState("");
  const [formSuccess, setFormSuccess] = React.useState("");

  React.useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks(search);
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditBook(null);
    setTitle("");
    setAuthor("");
    setIsbn("");
    setCategory("");
    setCopiesTotal(1);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (book) => {
    setEditBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setCategory(book.category);
    setCopiesTotal(book.copies_total);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this book from the catalog?",
      )
    ) {
      try {
        await bookService.deleteBook(id);
        fetchBooks();
      } catch (err) {
        alert("Failed to delete book. It might be currently checked out.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!title || !author || !isbn || !category || !copiesTotal) {
      setFormError("All fields are required.");
      return;
    }

    const payload = {
      title,
      author,
      isbn,
      category,
      copies_total: parseInt(copiesTotal, 10),
    };

    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, payload);
        setFormSuccess("Book updated successfully!");
      } else {
        await bookService.createBook(payload);
        setFormSuccess("Book added to catalog successfully!");
      }
      setTimeout(() => {
        setIsModalOpen(false);
        fetchBooks();
      }, 1000);
    } catch (err) {
      setFormError(
        err.response?.data?.detail || "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header
          onSearchChange={setSearch}
          searchPlaceholder="Search books by title, author, or ISBN..."
        />
        <main className="p-8 mt-16 max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Book Catalog</h2>
              <p className="text-slate-400 text-sm mt-1">
                Manage your library collection.
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-indigo-600/10"
            >
              <Plus className="w-4 h-4" /> Add New Book
            </button>
          </div>

          {/* Book Table */}
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-lg h-96 animate-pulse" />
          ) : (
            <BookTable
              books={books}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteBook}
            />
          )}

          {/* Add/Edit Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
                  <h3 className="font-bold text-lg text-white">
                    {editingBook ? "Edit Book Details" : "Add New Book"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg flex items-center gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}
                  {formSuccess && (
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Book Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Great Gatsby"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="e.g. F. Scott Fitzgerald"
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        ISBN
                      </label>
                      <input
                        type="text"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        placeholder="e.g. 9780743273565"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Fiction"
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Total Copies
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={copiesTotal}
                      onChange={(e) => setCopiesTotal(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 text-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/10"
                    >
                      {editingBook ? "Save Changes" : "Add Book"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
