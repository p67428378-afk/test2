import React, { useState } from "react";
import { Star, Trash2 } from "lucide-react";

export default function RatedItem({ entry, onClearRating, onRate }) {
  const [isClearing, setIsClearing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const film = entry.film;
  const rating = entry.rating;

  const handleClear = async () => {
    if (isClearing) return;
    setIsClearing(true);
    setError(null);
    try {
      await onClearRating(film.id);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to clear rating");
      setIsClearing(false);
    }
  };

  const handleStarClick = async (starValue) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setError(null);
    try {
      if (rating === starValue) {
        await onClearRating(film.id);
      } else {
        await onRate(film.id, starValue);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update rating");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="bg-[#1f293b] border border-[#334054] border-solid content-stretch flex gap-[12px] items-center overflow-clip p-[12px] relative rounded-[10px] shrink-0 w-full"
      data-node-id="1:147"
      data-name="RatedItem"
    >
      {/* Mini Poster */}
      <div
        className="bg-[#141c2b] content-stretch flex flex-col h-[64px] items-center justify-center overflow-clip relative rounded-[6px] shrink-0 w-[48px]"
        data-node-id="1:148"
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
            data-node-id="1:149"
          >
            🎬
          </p>
        )}
      </div>

      {/* Info */}
      <div
        className="flex flex-[1_0_0] flex-row items-center self-stretch"
        data-node-id="1:150"
      >
        <div
          className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] h-full items-start leading-[normal] min-w-px not-italic overflow-clip relative whitespace-nowrap"
          data-name="Info"
        >
          <div
            className="content-stretch flex gap-[4px] items-baseline overflow-clip relative shrink-0"
            data-node-id="1:151"
            data-name="TitleRow"
          >
            <p
              className="font-bold relative shrink-0 text-[#f7fafc] text-[16px]"
              data-node-id="1:152"
            >
              {film.title}
            </p>
            <p
              className="font-normal relative shrink-0 text-[#94a3b8] text-[14px]"
              data-node-id="1:153"
            >
              ({film.release_year})
            </p>
          </div>
          <p
            className="font-normal relative shrink-0 text-[#94a3b8] text-[12px]"
            data-node-id="1:154"
          >
            {film.genre}
          </p>
        </div>
      </div>

      {/* Rating Box & Actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {/* Interactive Stars */}
          <div className="flex gap-0.5 bg-[#141c2b] p-1 rounded-[6px] border border-[#334054]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                disabled={isUpdating}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={14}
                  className={
                    star <= rating
                      ? "fill-[#f5a826] text-[#f5a826]"
                      : "text-[#94a3b8]"
                  }
                />
              </button>
            ))}
          </div>

          {/* Numeric Badge */}
          <div
            className="[word-break:break-word] bg-[#141c2b] content-stretch flex gap-[4px] items-center leading-[normal] not-italic overflow-clip p-[6px] relative rounded-[6px] shrink-0 whitespace-nowrap"
            data-node-id="1:155"
            data-name="RatingBox"
          >
            <p
              className="font-bold relative shrink-0 text-[#f7fafc] text-[12px]"
              data-node-id="1:157"
            >
              {rating}/5
            </p>
          </div>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            disabled={isClearing}
            className="p-1.5 text-[#94a3b8] hover:text-red-500 hover:bg-[#141c2b] rounded-[6px] transition-colors"
            title="Clear Rating"
            aria-label="Clear Rating"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
