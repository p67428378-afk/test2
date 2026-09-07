import React, { useState } from "react";

const NameCard = ({ name, genre, onCopy, isFavorite, onToggleFavorite }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(name);
    }
    setCopied(true);
    if (onCopy) onCopy(name);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center p-4 bg-[#051424] border border-[#273647] rounded-lg hover:border-[#3b494b] transition-colors">
      <div>
        <div className="font-bold text-base text-[#d4e4fa]">{name}</div>
        <div className="text-xs text-[#849495] flex items-center gap-2 mt-0.5">
          <span className="capitalize px-2 py-0.5 bg-[#122131] border border-[#273647] rounded text-[11px] text-[#00f0ff]">
            {genre}
          </span>
          <span>• Unique Pattern</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${name}`}
          className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
            copied
              ? "bg-[#00dbe9]/20 text-[#00dbe9] border border-[#00dbe9]/40"
              : "bg-[#273647] text-[#d4e4fa] hover:bg-[#3b494b]"
          }`}
        >
          <span>{copied ? "✓ Copied" : "📋 Copy"}</span>
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(name, genre)}
          aria-label={isFavorite ? `Unsave ${name}` : `Save ${name}`}
          className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1 ${
            isFavorite
              ? "bg-[#7000ff] text-white font-medium shadow-md hover:bg-[#5b00cc]"
              : "bg-[#273647] text-[#849495] hover:text-[#d4e4fa] hover:bg-[#3b494b]"
          }`}
        >
          <span>{isFavorite ? "❤️ Saved" : "🤍 Save"}</span>
        </button>
      </div>
    </div>
  );
};

export default NameCard;
