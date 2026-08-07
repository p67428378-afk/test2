import React, { useState, useEffect } from "react";
import BookTable from "../components/book/BookTable.jsx";
import { bookService } from "../services/api.js";
import {
  Plus,
  TrendingUp,
  BookOpen,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function DashboardPage({
  onAddBook,
  onEditBook,
  onViewDetails,
}) {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    activeLoans: 0,
    overdue: 0,
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks(
        search,
        genre === "Genre: All" ? "" : genre,
      );

      // If the response is paginated (has items, total, etc.)
      if (data && data.items) {
        setBooks(data.items);
        setStats((prev) => ({
          ...prev,
          total: data.total || data.items.length,
        }));
      } else if (Array.isArray(data)) {
        setBooks(data);
        setStats((prev) => ({
          ...prev,
          total: data.length,
        }));
      } else {
        setBooks([]);
      }
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
  }, [search, genre]);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await bookService.deleteBook(bookId);
      fetchBooks();
    } catch (err) {
      setError("Failed to delete book.");
    }
  };

  const genres = ["Genre: All", "Fiction", "Science", "History", "Biography"];

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Books
          </p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold text-slate-100">
              {stats.total}
            </span>
            <span className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.3% this month
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Loans
          </p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold text-slate-100">1,840</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overdue Books
          </p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-3xl font-bold text-rose-400">45</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1 w-full">
          <div className="relative max-w-xs w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books by title, author, or ISBN..."
              className="w-full pl-4 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div className="relative max-w-xs w-full">
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm appearance-none cursor-pointer"
            >
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={onAddBook}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </Button>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-emerald-500" />
          <span>Loading catalog...</span>
        </div>
      ) : (
        <BookTable
          books={books}
          onEdit={onEditBook}
          onDelete={handleDelete}
          onViewDetails={onViewDetails}
        />
      )}
    </div>
  );
}
