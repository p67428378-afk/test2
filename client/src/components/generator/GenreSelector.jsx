import React from "react";

const DEFAULT_GENRES = [
  {
    code: "cyberpunk",
    display_name: "Cyberpunk",
    description: "Futuristic, high-tech, low-life neon character names",
  },
  {
    code: "fantasy",
    display_name: "Fantasy",
    description: "Mythical, medieval, and magic-inspired character names",
  },
  {
    code: "sci-fi",
    display_name: "Sci-Fi",
    description: "Interstellar, cosmic, and spacefaring character names",
  },
  {
    code: "mystery",
    display_name: "Mystery",
    description: "Noir, detective, and investigative character names",
  },
  {
    code: "historical",
    display_name: "Historical",
    description: "Classical, epoch, and ancient historical names",
  },
  {
    code: "general",
    display_name: "General",
    description: "Versatile, contemporary, and modern character names",
  },
];

const GenreSelector = ({ selectedGenre, onSelectGenre, genres = [] }) => {
  const activeGenres = genres && genres.length > 0 ? genres : DEFAULT_GENRES;

  return (
    <div className="space-y-2">
      <label
        htmlFor="genre-select"
        className="block text-xs font-semibold text-[#849495] uppercase tracking-wider"
      >
        Genre Selection
      </label>
      <select
        id="genre-select"
        value={selectedGenre}
        onChange={(e) => onSelectGenre(e.target.value)}
        className="w-full p-3 bg-[#051424] border border-[#273647] rounded-lg text-sm text-[#d4e4fa] focus:outline-none focus:border-[#00f0ff] transition-colors"
      >
        {activeGenres.map((g) => (
          <option key={g.code || g.id} value={g.code}>
            {g.display_name || g.code}
          </option>
        ))}
      </select>

      {/* Quick Select Chips */}
      <div className="flex flex-wrap gap-2 pt-2">
        {activeGenres.map((g) => {
          const isSelected =
            selectedGenre.toLowerCase() === g.code.toLowerCase();
          return (
            <button
              key={g.code}
              type="button"
              onClick={() => onSelectGenre(g.code)}
              className={`px-2.5 py-1 text-xs rounded-md border transition-all ${
                isSelected
                  ? "bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] font-medium"
                  : "bg-[#051424] border-[#273647] text-[#849495] hover:text-[#d4e4fa] hover:border-[#3b494b]"
              }`}
            >
              {g.display_name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GenreSelector;
