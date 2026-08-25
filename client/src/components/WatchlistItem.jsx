import React, { useState } from "react";
import { Star } from "lucide-react";

export default function WatchlistItem({
  entry,
  currentRating,
  onRemove,
  onRate,
  onClearRating,
}) {
  const [isRemoving, setIsRemove] = useState(false);
  const [showRatingInline, setShowRatingInline] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [error, setError] = useState(null);

  const film = entry.film;

  const handleRemove = async () => {
    if (isRemoving) return;
    setIsRemove(true);
    setError(null);
    try {
      await onRemove(film.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to remove film");
      setIsRemove(false);
    }
  };

  const handleStarClick = async (starValue) => {
    if (isRating) return;
    setIsRating(true);
    setError(null);
    try {
      if (currentRating === starValue) {
        await onClearRating(film.id);
      } else {
        await onRate(film.id, starValue);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update rating");
    } finally {
      setIsRating(false);
    }
  };

  return (
    <div
      className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex flex-col sm:flex-row gap-[12px] items-start sm:items-center overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
      data-node-id="1:111"
      data-name="WatchlistItem"
    >
      <div className="flex items-center gap-[12px] w-full sm:w-auto flex-1">
        {/* Mini Poster */}
        <div
          className="bg-[#141c2b] content-stretch flex flex-col h-[64px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-[48px]"
          data-node-id="1:112"
          data-name="MiniPoster"
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
              className="[word-break:break-word] font-normal leading-[normal] not-italic relative shrink-0 text-[#f7fafc] text-[16px] whitespace-nowrap"
              data-node-id="1:113"
            >
              🎬
            </p>
          )}
        </div>

        {/* Info */}
        <div
          className="flex flex-[1_0_0] flex-row items-center self-stretch"
          data-node-id="1:114"
        >
          <div
            className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-full items-start leading-[normal] min-w-px not-italic overflow-clip relative whitespace-nowrap"
            data-name="Info"
          >
            <div
              className="content-stretch flex gap-[4px] items-baseline overflow-clip relative shrink-0"
              data-node-id="1:115"
              data-name="TitleRow"
            >
              <p
                className="font-bold relative shrink-0 text-[#f7fafc] text-[16px]"
                data-node-id="1:116"
              >
                {film.title}
              </p>
              <p
                className="font-normal relative shrink-0 text-[#94a3b8] text-[14px]"
                data-node-id="1:117"
              >
                ({film.release_year})
              </p>
            </div>
            <p
              className="font-normal relative shrink-0 text-[#94a3b8] text-[12px]"
              data-node-id="1:118"
            >
              {film.genre}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="content-stretch flex flex-col items-end gap-[8px] relative shrink-0 w-full sm:w-auto"
        data-node-id="1:119"
        data-name="Actions"
      >
        <div className="flex gap-[8px] w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowRatingInline(!showRatingInline)}
            className="bg-[#1f293b] border border-[#334054] border-solid text-[#f7fafc] hover:bg-[#334054] px-[16px] py-[12px] rounded-[10px] font-medium text-[14px] transition-colors"
            data-node-id="1:120"
          >
            {showRatingInline ? "Close Rating" : "Rate Movie"}
          </button>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="bg-[#1f293b] border border-[#334054] border-solid text-[#f7fafc] hover:bg-red-600 hover:text-white px-[16px] py-[12px] rounded-[10px] font-medium text-[14px] transition-colors"
            data-node-id="1:122"
          >
            {isRemoving ? "Removing..." : "Remove"}
          </button>
        </div>

        {showRatingInline && (
          <div className="flex items-center gap-1 mt-2 bg-[#141c2b] p-2 rounded-[8px] border border-[#334054]">
            <span className="text-xs text-[#94a3b8] mr-1">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                disabled={isRating}
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
        )}

        {error && (
          <p className="text-xs text-red-500 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
