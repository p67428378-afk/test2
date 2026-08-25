import React, { useState } from "react";
import { Star } from "lucide-react";

export default function FilmCard({
  film,
  isInWatchlist,
  currentRating,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onRate,
  onClearRating,
}) {
  const [isMutatingWatchlist, setIsMutatingWatchlist] = useState(false);
  const [isMutatingRating, setIsMutatingRating] = useState(false);
  const [error, setError] = useState(null);

  const handleWatchlistClick = async () => {
    if (isMutatingWatchlist) return;
    setIsMutatingWatchlist(true);
    setError(null);
    try {
      if (isInWatchlist) {
        await onRemoveFromWatchlist(film.id);
      } else {
        await onAddToWatchlist(film.id);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update watchlist");
    } finally {
      setIsMutatingWatchlist(false);
    }
  };

  const handleStarClick = async (starValue) => {
    if (isMutatingRating) return;
    setIsMutatingRating(true);
    setError(null);
    try {
      if (currentRating === starValue) {
        // Clear rating if clicking the same star
        await onClearRating(film.id);
      } else {
        await onRate(film.id, starValue);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update rating");
    } finally {
      setIsMutatingRating(false);
    }
  };

  return (
    <div
      className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[16px] relative rounded-[14px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.08)] w-full"
      data-node-id="1:27"
      data-name="FilmCard"
    >
      {/* Poster */}
      <div
        className="bg-[#141c2b] content-stretch flex flex-col h-[160px] items-center justify-center overflow-clip relative rounded-[10px] w-full"
        data-node-id="1:28"
        data-name="Poster"
      >
        {film.poster_url && !film.poster_url.includes("example.com") ? (
          <img
            src={film.poster_url}
            alt={film.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
        ) : (
          <p
            className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[32px] whitespace-nowrap"
            data-node-id="1:29"
          >
            🎬
          </p>
        )}
      </div>

      {/* Title & Year */}
      <div
        className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
        data-node-id="1:30"
        data-name="TitleRow"
      >
        <p
          className="font-bold relative shrink-0 text-[#f7fafc] text-[16px]"
          data-node-id="1:31"
        >
          {film.title}
        </p>
        <p
          className="font-normal relative shrink-0 text-[#94a3b8] text-[14px]"
          data-node-id="1:32"
        >
          ({film.release_year})
        </p>
      </div>

      {/* Genre */}
      <p
        className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[12px] whitespace-nowrap"
        data-node-id="1:33"
      >
        {film.genre}
      </p>

      {/* Watchlist Button */}
      <button
        onClick={handleWatchlistClick}
        disabled={isMutatingWatchlist}
        className={`w-full py-[12px] px-[16px] rounded-[10px] font-medium text-[14px] transition-colors flex items-center justify-center gap-2 ${
          isInWatchlist
            ? "bg-[#1f293b] border border-[#334054] text-[#f7fafc] hover:bg-[#334054]"
            : "bg-[#6173f5] text-white hover:bg-[#4f5fd8]"
        }`}
        data-node-id="1:34"
      >
        {isInWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
      </button>

      {/* Rating Stars */}
      <div
        className="[word-break:break-word] content-stretch flex font-normal gap-[4px] items-center leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
        data-node-id="1:36"
        data-name="StarsRow"
      >
        <p
          className="relative shrink-0 text-[#94a3b8] text-[12px]"
          data-node-id="1:37"
        >
          Your Rating:
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              disabled={isMutatingRating}
              className="focus:outline-none transition-transform hover:scale-110"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={16}
                className={
                  star <= currentRating
                    ? "fill-[#f5a826] text-[#f5a826]"
                    : "text-[#94a3b8]"
                }
              />
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <p className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
