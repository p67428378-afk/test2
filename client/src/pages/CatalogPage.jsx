import React, { useState, useEffect } from "react";
import { booksApi } from "../services/api";
import ProductCard from "../components/features/ProductCard";
import { Filter, SortAsc, RefreshCw } from "lucide-react";

export default function CatalogPage({ onAddToCart, onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    format: "Format: All",
    price_range: "Price: All",
  });
  const [sortBy, setSortBy] = useState("Featured");

  const fetchBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await booksApi.list({
        format: filters.format,
        price_range: filters.price_range,
      });

      // Apply sorting locally
      let sortedData = [...data];
      if (sortBy === "Price: Low to High") {
        sortedData.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortBy === "Price: High to Low") {
        sortedData.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortBy === "Newest Arrivals") {
        sortedData.sort(
          (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
        );
      }

      setBooks(sortedData);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(
        "Failed to load magical editions. Please ensure the backend server is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters, sortBy]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-lg">
      {/* Header Section */}
      <header className="flex flex-col gap-sm max-w-3xl">
        <h1 className="font-display-lg text-display-lg text-[#0F172A] tracking-tight">
          The Harry Potter Collection
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Explore all magical editions, from classic paperbacks to illustrated
          collector treasures.
        </p>
      </header>

      {/* Filter & Sort Bar */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md py-sm border-y border-[#E2E8F0]">
        <div className="flex flex-wrap items-center gap-sm">
          <span className="font-label-md text-on-surface-variant mr-2 flex items-center gap-1">
            <Filter size={18} /> Filters:
          </span>
          <div className="relative group">
            <select
              name="format"
              value={filters.format}
              onChange={handleFilterChange}
              className="appearance-none bg-white border border-[#E2E8F0] rounded pl-3 pr-8 py-1.5 font-label-md text-on-surface focus:outline-none focus:border-gold cursor-pointer hover:border-outline-variant transition-colors shadow-sm"
            >
              <option value="Format: All">Format: All</option>
              <option value="Hardcover">Hardcover</option>
              <option value="Paperback">Paperback</option>
              <option value="Illustrated">Illustrated</option>
              <option value="Special Edition">Special Edition</option>
            </select>
          </div>
          <div className="relative group">
            <select
              name="price_range"
              value={filters.price_range}
              onChange={handleFilterChange}
              className="appearance-none bg-white border border-[#E2E8F0] rounded pl-3 pr-8 py-1.5 font-label-md text-on-surface focus:outline-none focus:border-gold cursor-pointer hover:border-outline-variant transition-colors shadow-sm"
            >
              <option value="Price: All">Price: All</option>
              <option value="Under $20">Under $20</option>
              <option value="$20 - $50">$20 - $50</option>
              <option value="Over $50">Over $50</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-sm w-full sm:w-auto">
          <span className="font-label-md text-on-surface-variant flex items-center gap-1">
            <SortAsc size={18} /> Sort by:
          </span>
          <div className="relative group flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full bg-white border border-[#E2E8F0] rounded pl-3 pr-8 py-1.5 font-label-md text-on-surface focus:outline-none focus:border-gold cursor-pointer hover:border-outline-variant transition-colors shadow-sm"
            >
              <option value="Featured">Featured</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Newest Arrivals">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-xl gap-sm">
          <RefreshCw className="animate-spin text-gold" size={48} />
          <p className="font-body-lg text-on-surface-variant">
            Summoning magical editions...
          </p>
        </div>
      ) : error ? (
        <div className="p-lg bg-error-container text-on-error-container rounded-lg border border-error/20 text-center flex flex-col gap-md max-w-xl mx-auto">
          <p className="font-body-lg">{error}</p>
          <button
            onClick={fetchBooks}
            className="bg-gold hover:bg-[#B45309] text-white font-label-md py-2 px-4 rounded self-center transition-all active:scale-95"
          >
            Retry Summoning
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-xl border border-dashed border-[#E2E8F0] rounded-lg">
          <p className="font-body-lg text-on-surface-variant">
            No magical editions found matching your filters.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          {books.map((book) => (
            <ProductCard
              key={book.id}
              book={book}
              onAddToCart={onAddToCart}
              onClick={onSelectBook}
            />
          ))}
        </section>
      )}
    </div>
  );
}
