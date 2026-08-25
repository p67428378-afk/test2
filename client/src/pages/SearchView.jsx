import React, { useState, useEffect } from "react";
import { filmService, watchlistService, ratingService } from "../services/api";
import FilmCard from "../components/FilmCard";

export default function SearchView() {
  const [query, setQuery] = useState("");
  const [films, setFilms] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  // Fetch watchlist and ratings on mount to sync card states
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wlData, ratData] = await Promise.all([
          watchlistService.getWatchlist(),
          ratingService.getRatings(),
        ]);
        setWatchlist(wlData);
        setRatings(ratData);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query || query.trim().length < 2) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const results = await filmService.searchFilms(query.trim());
      setFilms(results);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to search films");
      setFilms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (filmId) => {
    const newEntry = await watchlistService.addToWatchlist(filmId);
    // Refresh watchlist
    const wlData = await watchlistService.getWatchlist();
    setWatchlist(wlData);
  };

  const handleRemoveFromWatchlist = async (filmId) => {
    await watchlistService.removeFromWatchlist(filmId);
    // Refresh watchlist
    const wlData = await watchlistService.getWatchlist();
    setWatchlist(wlData);
  };

  const handleRate = async (filmId, rating) => {
    await ratingService.rateFilm(filmId, rating);
    // Refresh ratings
    const ratData = await ratingService.getRatings();
    setRatings(ratData);
  };

  const handleClearRating = async (filmId) => {
    await ratingService.clearRating(filmId);
    // Refresh ratings
    const ratData = await ratingService.getRatings();
    setRatings(ratData);
  };

  const isFilmInWatchlist = (filmId) => {
    return watchlist.some((entry) => entry.film.id === filmId);
  };

  const getFilmRating = (filmId) => {
    const ratingEntry = ratings.find((entry) => entry.film.id === filmId);
    return ratingEntry ? ratingEntry.rating : 0;
  };

  return (
    <div
      className="bg-[#0f1729] content-stretch flex flex-col gap-[24px] items-start p-[32px] relative min-h-screen w-full"
      data-node-id="1:3"
      data-name="Search View"
    >
      {/* Header */}
      <div
        className="[word-break:break-word] content-stretch flex flex-col gap-[8px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
        data-node-id="1:14"
        data-name="Header"
      >
        <h1
          className="font-bold relative shrink-0 text-[#f7fafc] text-[32px]"
          data-node-id="1:15"
        >
          Search Films
        </h1>
        <p
          className="font-normal relative shrink-0 text-[#94a3b8] text-[16px]"
          data-node-id="1:16"
        >
          Discover new movies, add them to your watchlist, and rate your
          favorites.
        </p>
      </div>

      {/* Search Section */}
      <form
        onSubmit={handleSearch}
        className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0 w-full"
        data-node-id="1:17"
        data-name="SearchSection"
      >
        <div
          className="flex flex-[1_0_0] flex-row items-center self-stretch"
          data-node-id="1:18"
        >
          <div
            className="[word-break:break-word] bg-[#141c2b] border border-[#334054] border-solid content-stretch flex flex-[1_0_0] font-normal gap-[8px] h-full items-center leading-[normal] min-w-px not-italic overflow-clip p-[12px] relative rounded-[10px] text-[#94a3b8] text-[14px] whitespace-nowrap"
            data-name="SearchBar"
          >
            <span className="relative shrink-0" data-node-id="1:19">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for films by title (e.g., Inception, Interstellar)..."
              className="bg-transparent border-none outline-none text-white w-full placeholder-[#94a3b8]"
              data-node-id="1:20"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!query || query.trim().length < 2 || loading}
          className={`bg-[#6173f5] content-stretch flex items-center justify-center overflow-clip px-[16px] py-[12px] relative rounded-[10px] shrink-0 font-medium text-[14px] text-white whitespace-nowrap hover:bg-[#4f5fd8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          data-node-id="1:21"
          data-name="Button"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results Header */}
      {searched && !loading && (
        <div
          className="[word-break:break-word] content-stretch flex items-center justify-between leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
          data-node-id="1:23"
          data-name="ResultsHeader"
        >
          <p
            className="font-bold relative shrink-0 text-[#f7fafc] text-[18px]"
            data-node-id="1:24"
          >
            Search Results for "{query}"
          </p>
          <p
            className="font-normal relative shrink-0 text-[#94a3b8] text-[14px]"
            data-node-id="1:25"
          >
            {films.length} {films.length === 1 ? "film" : "films"} found
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div
          className="bg-red-900/20 border border-red-500 text-red-200 p-4 rounded-[10px] w-full"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Films Grid */}
      {loading ? (
        <div className="flex justify-center items-center w-full py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6173f5]"></div>
        </div>
      ) : films.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px] w-full"
          data-node-id="1:26"
          data-name="FilmGridRow"
        >
          {films.map((film) => (
            <FilmCard
              key={film.id}
              film={film}
              isInWatchlist={isFilmInWatchlist(film.id)}
              currentRating={getFilmRating(film.id)}
              onAddToWatchlist={handleAddToWatchlist}
              onRemoveFromWatchlist={handleRemoveFromWatchlist}
              onRate={handleRate}
              onClearRating={handleClearRating}
            />
          ))}
        </div>
      ) : (
        searched &&
        !error && (
          <div className="text-center py-12 w-full bg-[#1f293b] rounded-[14px] border border-[#334054] p-8">
            <p className="text-[#94a3b8] text-[16px]">
              No films found matching your search.
            </p>
          </div>
        )
      )}
    </div>
  );
}
