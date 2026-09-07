import React, { useState } from "react";

const FavoritesList = ({
  favorites = [],
  onRemoveFavorite,
  onClearFavorites,
  onCopy,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState("all");

  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGenre =
      selectedGenreFilter === "all" ||
      item.genre.toLowerCase() === selectedGenreFilter.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  const uniqueGenres = Array.from(
    new Set(favorites.map((f) => f.genre.toLowerCase())),
  );

  const exportData = (format) => {
    if (favorites.length === 0) return;

    let content = "";
    let mimeType = "text/plain";
    let filename = `character-names-favorites.${format}`;

    if (format === "json") {
      content = JSON.stringify(favorites, null, 2);
      mimeType = "application/json";
    } else if (format === "csv") {
      content =
        "Name,Genre,SavedAt\n" +
        favorites
          .map((f) => `"${f.name}","${f.genre}","${f.savedAt || ""}"`)
          .join("\n");
      mimeType = "text/csv";
    } else {
      content = favorites.map((f) => `${f.name} (${f.genre})`).join("\n");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#122131] p-6 border border-[#273647] rounded-xl">
        <div>
          <h1 className="text-2xl font-bold text-[#d4e4fa]">
            Session Favorites ({favorites.length} Saved)
          </h1>
          <p className="text-xs text-[#849495] mt-1">
            Browse, filter, and export your favorited character names during
            this session.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="dropdown relative inline-block text-left">
            <button
              type="button"
              onClick={() => exportData("txt")}
              disabled={favorites.length === 0}
              className="px-3 py-2 bg-[#273647] border border-[#3b494b] text-xs font-medium rounded-lg text-[#d4e4fa] hover:bg-[#3b494b] disabled:opacity-50"
            >
              📥 Export .TXT
            </button>
          </div>
          <button
            type="button"
            onClick={() => exportData("json")}
            disabled={favorites.length === 0}
            className="px-3 py-2 bg-[#273647] border border-[#3b494b] text-xs font-medium rounded-lg text-[#d4e4fa] hover:bg-[#3b494b] disabled:opacity-50"
          >
            📥 Export .JSON
          </button>
          <button
            type="button"
            onClick={() => exportData("csv")}
            disabled={favorites.length === 0}
            className="px-3 py-2 bg-[#273647] border border-[#3b494b] text-xs font-medium rounded-lg text-[#d4e4fa] hover:bg-[#3b494b] disabled:opacity-50"
          >
            📥 Export .CSV
          </button>
          {favorites.length > 0 && (
            <button
              type="button"
              onClick={onClearFavorites}
              className="px-3 py-2 bg-red-500/10 border border-red-500/30 text-xs font-medium rounded-lg text-red-400 hover:bg-red-500/20"
            >
              🗑️ Clear All
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search saved names..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-3 bg-[#122131] border border-[#273647] rounded-lg text-sm text-[#d4e4fa] focus:outline-none focus:border-[#00f0ff]"
        />
        <select
          value={selectedGenreFilter}
          onChange={(e) => setSelectedGenreFilter(e.target.value)}
          className="p-3 bg-[#122131] border border-[#273647] rounded-lg text-sm text-[#d4e4fa] focus:outline-none focus:border-[#00f0ff]"
        >
          <option value="all">All Genres</option>
          {uniqueGenres.map((g) => (
            <option key={g} value={g} className="capitalize">
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* List Grid */}
      {filteredFavorites.length === 0 ? (
        <div className="p-12 text-center bg-[#122131] border border-[#273647] rounded-xl space-y-3">
          <div className="text-4xl">🤍</div>
          <h3 className="text-lg font-bold text-[#d4e4fa]">
            No favorites found
          </h3>
          <p className="text-sm text-[#849495]">
            {favorites.length === 0
              ? 'Generate character names on the Generator dashboard and click "Save" to collect them here.'
              : "No saved names match your current search or genre filter."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((item) => (
            <div
              key={item.name}
              className="p-4 bg-[#122131] border border-[#273647] rounded-lg flex justify-between items-center hover:border-[#3b494b] transition-colors"
            >
              <div>
                <div className="font-bold text-[#d4e4fa] text-base">
                  {item.name}
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#7000ff] text-[10px] rounded text-white font-medium capitalize">
                  {item.genre}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onCopy(item.name)}
                  aria-label={`Copy ${item.name}`}
                  className="p-2 bg-[#273647] rounded text-xs hover:bg-[#3b494b] text-[#d4e4fa]"
                >
                  📋
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFavorite(item.name)}
                  aria-label={`Remove ${item.name}`}
                  className="p-2 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
