import React, { useState, useEffect } from "react";
import BookCard from "../components/member/BookCard.jsx";
import MyLoansTable from "../components/member/MyLoansTable.jsx";
import MyFinesPanel from "../components/member/MyFinesPanel.jsx";
import SearchBar from "../components/common/SearchBar.jsx";
import { bookService, loanService, fineService } from "../services/api.js";

export default function MemberPortal({ user }) {
  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fines, setFines] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [booksData, loansData, finesData] = await Promise.all([
        bookService.getBooks(search, genre),
        loanService.getMemberLoans(user.id),
        fineService.getFines(), // Fines endpoint returns all fines, we will filter for this member
      ]);

      setBooks(booksData);
      setLoans(loansData);

      // Filter fines for this member
      const memberFines = finesData.filter(
        (f) => f.loan?.member_id === user.id,
      );
      setFines(memberFines);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load portal data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, search, genre]);

  const handleBorrow = async (bookId) => {
    if (!user?.id) return;
    try {
      await loanService.checkoutBook(bookId, user.id);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to borrow book.");
    }
  };

  const handlePayFine = async (fineId) => {
    try {
      await fineService.payFine(fineId);
      fetchData();
    } catch (err) {
      setError("Failed to process fine payment.");
    }
  };

  // Extract unique genres for filter dropdown
  const genres = Array.from(new Set(books.map((b) => b.genre).filter(Boolean)));

  if (loading && books.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading portal...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-slate-100 text-lg">
          Search Library Catalog
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by title, author, or ISBN..."
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500 text-sm"
          >
            <option value="">All Genres</option>
            {genres.map((g, idx) => (
              <option key={idx} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Book Catalog Grid */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-100 text-lg">
          Available Books
        </h3>
        {books.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            No books match your search criteria.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrow={handleBorrow}
                isLibrarian={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Loans & Fines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MyLoansTable loans={loans} />
        </div>
        <div>
          <MyFinesPanel fines={fines} onPayFine={handlePayFine} />
        </div>
      </div>
    </div>
  );
}
