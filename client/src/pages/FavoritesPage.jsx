import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { favoritesService, authService } from "../services/api";
import QuoteCard from "../components/quotes/QuoteCard";
import EmptyStateCard from "../components/quotes/EmptyStateCard";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import SearchBar from "../components/common/SearchBar";
import Dropdown from "../components/common/Dropdown";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportMessage, setExportMessage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await favoritesService.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await favoritesService.removeFavorite(favoriteId);
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  // Copy all favorites to clipboard
  const handleCopyAll = async () => {
    if (favorites.length === 0) return;
    const textToCopy = favorites
      .map((f) => `"${f.quote?.text}" - ${f.quote?.author}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(textToCopy);
      showExportMessage("Copied all favorites to clipboard!");
    } catch (err) {
      console.error("Failed to copy all: ", err);
    }
  };

  // Export as JSON
  const handleExportJSON = () => {
    if (favorites.length === 0) return;
    const dataStr = JSON.stringify(favorites, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotegen_favorites.json";
    link.click();
    URL.revokeObjectURL(url);
    showExportMessage("Exported as JSON successfully!");
  };

  // Export as CSV
  const handleExportCSV = () => {
    if (favorites.length === 0) return;
    const headers = ["ID", "Text", "Author", "Category", "Saved At"];
    const rows = favorites.map((f) => [
      f.id,
      `"${f.quote?.text?.replace(/"/g, '""')}"`,
      `"${f.quote?.author?.replace(/"/g, '""')}"`,
      f.quote?.category || "General",
      f.created_at,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quotegen_favorites.csv";
    link.click();
    URL.revokeObjectURL(url);
    showExportMessage("Exported as CSV successfully!");
  };

  const showExportMessage = (msg) => {
    setExportMessage(msg);
    setTimeout(() => setExportMessage(null), 3000);
  };

  // Get unique categories for dropdown
  const categories = [
    "All",
    ...new Set(favorites.map((f) => f.quote?.category || "General")),
  ];
  const categoryOptions = categories.map((cat) => ({ label: cat, value: cat }));

  // Filter favorites
  const filteredFavorites = favorites.filter((f) => {
    const quote = f.quote;
    if (!quote) return false;

    const matchesSearch =
      quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author.toLowerCase().includes(searchQuery.toLowerCase());

    const category = quote.category || "General";
    const matchesCategory =
      selectedCategory === "All" || category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate category breakdown
  const categoryBreakdown = favorites.reduce((acc, f) => {
    const cat = f.quote?.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6 items-start w-full">
      <div className="flex flex-col gap-1 items-start w-full">
        <h1 className="font-bold text-[#171c29] text-3xl">
          Your Favorite Quotes
        </h1>
        <p className="text-[#707a8c] text-sm">
          Manage, search, and share your curated collection of inspiring quotes.
        </p>
      </div>

      {exportMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm w-full">
          ✅ {exportMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm w-full">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-[#707a8c] w-full">
          Loading your favorites...
        </div>
      ) : favorites.length === 0 ? (
        <EmptyStateCard onActionClick={() => navigate("/")} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* Main Column */}
          <div className="lg:col-span-8 flex flex-col gap-6 w-full">
            {/* Search & Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 w-full items-end">
              <div className="sm:col-span-8">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search favorites by text or author..."
                />
              </div>
              <div className="sm:col-span-4">
                <Dropdown
                  label="Category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categoryOptions}
                />
              </div>
            </div>

            {/* Favorites Grid */}
            <div className="flex flex-col gap-4 w-full">
              {filteredFavorites.length > 0 ? (
                filteredFavorites.map((fav) => (
                  <QuoteCard
                    key={fav.id}
                    quote={fav.quote}
                    showRemoveButton={true}
                    onRemove={() => handleRemoveFavorite(fav.id)}
                  />
                ))
              ) : (
                <div className="bg-white border border-dashed border-[#e3e8f0] rounded-2xl p-8 text-center text-[#707a8c] text-sm">
                  No favorites match your search criteria.
                </div>
              )}
            </div>
          </div>

          {/* Side Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            {/* Export & Share */}
            <Card title="Export & Share">
              <p className="text-[#707a8c] text-xs">
                Share your entire collection or back it up for safekeeping.
              </p>
              <div className="flex flex-col gap-3 w-full mt-2">
                <Button variant="primary" onClick={handleCopyAll}>
                  <span>📋</span>
                  <span>Copy All Favorites</span>
                </Button>
                <Button variant="secondary" onClick={handleExportJSON}>
                  <span>📥</span>
                  <span>Export as JSON</span>
                </Button>
                <Button variant="secondary" onClick={handleExportCSV}>
                  <span>📥</span>
                  <span>Export as CSV</span>
                </Button>
              </div>
            </Card>

            {/* Category Breakdown */}
            <Card title="Category Breakdown">
              <div className="flex flex-col gap-3 w-full">
                {Object.entries(categoryBreakdown).map(([cat, count]) => (
                  <div
                    key={cat}
                    className="flex items-center justify-between text-sm text-[#171c29]"
                  >
                    <p className="font-normal">{cat}</p>
                    <p className="font-medium text-[#707a8c]">
                      {count} {count === 1 ? "quote" : "quotes"}
                    </p>
                  </div>
                ))}
                <div className="bg-[#e3e8f0] h-px w-full my-1" />
                <div className="flex items-center justify-between text-sm font-bold">
                  <p className="text-[#171c29]">Total Saved</p>
                  <p className="text-[#2663eb]">
                    {favorites.length}{" "}
                    {favorites.length === 1 ? "quote" : "quotes"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
