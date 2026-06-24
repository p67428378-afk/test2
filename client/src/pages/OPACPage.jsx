import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Library,
  LogIn,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";
import { bookService } from "../services/api";

const OPACPage = () => {
  const [books, setBooks] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchBooks();
  }, [search]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await bookService.getBooks(search);
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books for OPAC", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Public Header */}
      <header className="bg-slate-900 border-b border-slate-800 h-16 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white leading-tight">
              LibSphere
            </h1>
            <p className="text-slate-400 text-xs">Public Catalog (OPAC)</p>
          </div>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-indigo-600/10"
        >
          <LogIn className="w-4 h-4" /> Librarian Login
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-8 space-y-8">
        {/* Hero Search Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
            Find Your Next Read
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Search our extensive collection of books, journals, and digital
            resources.
          </p>
          <div className="max-w-2xl mx-auto relative flex items-center mt-6">
            <Search className="w-5 h-5 absolute left-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 transition-colors text-base placeholder-slate-500 shadow-xl"
            />
          </div>
        </div>

        {/* Catalog Results */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Catalog Collection
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-40 animate-pulse"
                />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
              <p className="text-slate-500 text-lg">
                No books found matching your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-bold text-lg text-white leading-snug">
                        {book.title}
                      </h4>
                      <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                        {book.category}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">by {book.author}</p>
                    <p className="text-slate-500 text-xs font-mono">
                      ISBN: {book.isbn}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                    <div className="text-xs text-slate-400">
                      Copies Available:{" "}
                      <span className="text-indigo-400 font-semibold">
                        {book.copies_available}
                      </span>
                    </div>
                    <div>
                      {book.copies_available > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          <CheckCircle className="w-3 h-3" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
                          <XCircle className="w-3 h-3" /> Checked Out
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Public Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500 mt-12">
        <p>
          © {new Date().getFullYear()} LibSphere Library System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default OPACPage;
