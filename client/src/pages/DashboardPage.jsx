import React, { useState, useEffect } from "react";
import GenreSelector from "../components/generator/GenreSelector";
import QuantityControl from "../components/generator/QuantityControl";
import NameCard from "../components/generator/NameCard";
import { getGenres, generateNames } from "../services/api";

const SUB_TAG_OPTIONS = [
  { id: "male", label: "Masculine" },
  { id: "female", label: "Feminine" },
  { id: "neutral", label: "Neutral" },
  { id: "dark", label: "Dark / Gritty" },
  { id: "noble", label: "Highborn / Noble" },
];

const DashboardPage = ({
  favorites = [],
  onToggleFavorite,
  onShowToast,
  selectedGenre,
  setSelectedGenre,
}) => {
  const [quantity, setQuantity] = useState(5);
  const [selectedSubTags, setSelectedSubTags] = useState([]);
  const [generatedNames, setGeneratedNames] = useState([
    "Kaelen Cross",
    "Eldrin Shadowweaver",
    "Vaelen Starstrider",
    "Arthur Pendelton",
    "Marcus Aurelius",
  ]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalGeneratedCount, setTotalGeneratedCount] = useState(1248);

  useEffect(() => {
    const fetchGenreList = async () => {
      try {
        const data = await getGenres();
        if (Array.isArray(data)) {
          setGenres(data);
        }
      } catch (err) {
        console.warn(
          "Could not fetch active genres list from API, using defaults:",
          err,
        );
      }
    };
    fetchGenreList();
  }, []);

  const handleToggleSubTag = (tagId) => {
    if (selectedSubTags.includes(tagId)) {
      setSelectedSubTags(selectedSubTags.filter((t) => t !== tagId));
    } else {
      setSelectedSubTags([...selectedSubTags, tagId]);
    }
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await generateNames({
        genre: selectedGenre,
        quantity: quantity,
        sub_tags: selectedSubTags,
      });

      if (response && response.names && Array.isArray(response.names)) {
        setGeneratedNames(response.names);
        setTotalGeneratedCount((prev) => prev + response.names.length);
        onShowToast(
          `Successfully generated ${response.names.length} ${selectedGenre} names!`,
          "success",
        );
      } else {
        throw new Error("Invalid response structure from name generator");
      }
    } catch (err) {
      console.error("Failed to generate names:", err);
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Failed to generate names. Please check input parameters.";
      setError(errorMsg);
      onShowToast(`Error: ${errorMsg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const favoriteNamesSet = new Set(favorites.map((f) => f.name));

  return (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#122131] border border-[#273647] rounded-lg">
          <div className="text-xs text-[#849495] uppercase font-semibold">
            Active Genre
          </div>
          <div className="text-xl font-bold text-[#d4e4fa] capitalize mt-1">
            {selectedGenre}
          </div>
        </div>
        <div className="p-4 bg-[#122131] border border-[#273647] rounded-lg">
          <div className="text-xs text-[#849495] uppercase font-semibold">
            Total Generated
          </div>
          <div className="text-xl font-bold text-[#d4e4fa] mt-1">
            {totalGeneratedCount.toLocaleString()}
          </div>
        </div>
        <div className="p-4 bg-[#122131] border border-[#273647] rounded-lg">
          <div className="text-xs text-[#849495] uppercase font-semibold">
            Uniqueness Rate
          </div>
          <div className="text-xl font-bold text-[#00dbe9] mt-1">100%</div>
        </div>
        <div className="p-4 bg-[#122131] border border-[#273647] rounded-lg">
          <div className="text-xs text-[#849495] uppercase font-semibold">
            Session Favorites
          </div>
          <div className="text-xl font-bold text-[#00f0ff] mt-1">
            {favorites.length} Saved
          </div>
        </div>
      </div>

      {/* Main Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Controls */}
        <div className="lg:col-span-5 p-6 bg-[#122131] border border-[#273647] rounded-xl space-y-6 h-fit">
          <div className="border-b border-[#273647] pb-3">
            <h2 className="text-lg font-bold text-[#d4e4fa]">
              Generator Controls
            </h2>
            <p className="text-xs text-[#849495]">
              Configure genre, quantity, and sub-attributes to generate names.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6">
            <GenreSelector
              selectedGenre={selectedGenre}
              onSelectGenre={setSelectedGenre}
              genres={genres}
            />

            <QuantityControl
              quantity={quantity}
              onChangeQuantity={setQuantity}
            />

            {/* Sub-Tag Filter Chips */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#849495] uppercase tracking-wider">
                Sub-Attributes (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {SUB_TAG_OPTIONS.map((tag) => {
                  const active = selectedSubTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleSubTag(tag.id)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        active
                          ? "bg-[#7000ff]/20 border-[#7000ff] text-[#00f0ff] font-medium"
                          : "bg-[#051424] border-[#273647] text-[#849495] hover:text-[#d4e4fa]"
                      }`}
                    >
                      {active ? "✓ " : "+ "}
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div
                className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#00f0ff] to-[#7000ff] text-[#00363a] font-bold rounded-lg shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#00f0ff] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-lg">⚙️</span>
                  <span>Generating Names...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate Unique Names</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Results */}
        <div className="lg:col-span-7 p-6 bg-[#122131] border border-[#273647] rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-[#273647] pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#d4e4fa]">
                Generated Results ({generatedNames.length})
              </h2>
              <p className="text-xs text-[#849495]">
                Click copy to grab name or save to session favorites.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-[#051424] border border-[#273647] text-xs text-[#00dbe9] rounded font-mono uppercase">
              Genre: {selectedGenre}
            </span>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {generatedNames.map((name) => (
              <NameCard
                key={name}
                name={name}
                genre={selectedGenre}
                isFavorite={favoriteNamesSet.has(name)}
                onCopy={(copiedName) =>
                  onShowToast(`Copied "${copiedName}" to clipboard!`, "info")
                }
                onToggleFavorite={(favName, favGenre) =>
                  onToggleFavorite(favName, favGenre)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
