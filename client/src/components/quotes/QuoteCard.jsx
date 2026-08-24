import React, { useState } from "react";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function QuoteCard({
  quote,
  isFavorite = false,
  onFavoriteToggle,
  onRemove,
  badgeText = null,
  updatedText = null,
  showRemoveButton = false,
}) {
  const [copied, setCopied] = useState(false);

  if (!quote) return null;

  const handleCopy = async () => {
    const textToCopy = `"${quote.text}" — ${quote.author}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="bg-[#f2f5fa] border border-[#e3e8f0] flex flex-col gap-3 p-6 rounded-2xl w-full transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        {badgeText ? (
          <Badge variant="primary">{badgeText}</Badge>
        ) : quote.category ? (
          <Badge variant="secondary">{quote.category}</Badge>
        ) : (
          <Badge variant="secondary">General</Badge>
        )}
        {updatedText && <p className="text-[#707a8c] text-xs">{updatedText}</p>}
      </div>

      <p className="font-bold text-[#171c29] text-lg md:text-xl leading-relaxed">
        “{quote.text}”
      </p>

      <p className="font-medium text-[#707a8c] text-sm">— {quote.author}</p>

      <div className="bg-[#e3e8f0] h-px w-full my-1" />

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-[#707a8c] text-xs">
          Category: {quote.category || "General"}
        </p>

        <div className="flex gap-2 items-center">
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="!py-2 !px-3"
          >
            <span>📋</span>
            <span>{copied ? "Copied!" : "Copy"}</span>
          </Button>

          {showRemoveButton ? (
            <Button
              variant="outlineDanger"
              onClick={onRemove}
              className="!py-2 !px-3"
            >
              <span>🗑️</span>
              <span>Remove</span>
            </Button>
          ) : (
            <Button
              variant={isFavorite ? "secondary" : "primary"}
              onClick={onFavoriteToggle}
              className="!py-2 !px-3"
            >
              <span>{isFavorite ? "❤️" : "🤍"}</span>
              <span>{isFavorite ? "Favorited" : "Favorite"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
